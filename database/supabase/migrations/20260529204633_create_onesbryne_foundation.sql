-- ============================================================================
-- Onesbryne Foundation
-- Creates the standalone catalog database, RLS policies, and image storage
-- bucket for the Onesbryne curated resale app.
--
-- Current schema files:
-- - schema/public/schema.sql
-- - schema/public/extensions.sql
-- - schema/private/schema.sql
-- - schema/private/functions/auth.sql
-- - schema/public/tables/profiles.sql
-- - schema/public/tables/categories.sql
-- - schema/public/tables/pieces.sql
-- - schema/public/tables/piece_images.sql
-- - schema/public/tables/favourites.sql
-- - schema/storage/piece_images.sql
-- ============================================================================
-- ============================================================================
-- Step 1: Enable required extensions and create the private helper schema.
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS private;

COMMENT ON SCHEMA private IS 'Private helper functions for Onesbryne. This schema must not be exposed through the Data API.';

REVOKE ALL ON SCHEMA private FROM public;

COMMENT ON SCHEMA public IS 'Onesbryne app-facing catalog and profile data.';

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ============================================================================
-- Step 2: Create profile rows linked to Supabase Auth users.
-- ============================================================================
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name text,
    app_role text NOT NULL DEFAULT 'customer',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT profiles_display_name_length_check CHECK (display_name IS NULL OR char_length(btrim(display_name)) BETWEEN 1 AND 100),
    CONSTRAINT profiles_app_role_check CHECK (app_role IN ('customer', 'admin'))
);

COMMENT ON TABLE public.profiles IS 'Onesbryne app profile and role data linked to Supabase Auth users.';

COMMENT ON COLUMN public.profiles.id IS 'Matches auth.users.id and auth.uid().';

COMMENT ON COLUMN public.profiles.display_name IS 'Customer-facing display name. This is not used for authorization.';

COMMENT ON COLUMN public.profiles.app_role IS 'Application role. Only database/admin tooling should promote users to admin.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 3: Create private auth helpers and maintenance triggers.
-- ============================================================================
CREATE FUNCTION private.is_admin ()
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER STABLE
    SET search_path = public, pg_temp
    AS $$
    SELECT
        EXISTS (
            SELECT
                1
            FROM
                public.profiles profile
            WHERE
                profile.id = (
                    SELECT
                        auth.uid ())
                    AND profile.app_role = 'admin');
$$;

COMMENT ON FUNCTION private.is_admin () IS 'Checks whether the current authenticated user is an Onesbryne admin without recursively applying profile RLS.';

REVOKE EXECUTE ON FUNCTION private.is_admin () FROM public, anon;

GRANT EXECUTE ON FUNCTION private.is_admin () TO authenticated, service_role;

CREATE FUNCTION private.create_profile_for_auth_user ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, private, pg_temp
    AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, app_role)
        VALUES (NEW.id, NULLIF (btrim(COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1), '')), ''), 'customer') ON CONFLICT (id)
                DO NOTHING;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION private.create_profile_for_auth_user () IS 'Creates the Onesbryne profile row after Supabase Auth creates a user.';

REVOKE EXECUTE ON FUNCTION private.create_profile_for_auth_user () FROM public, anon, authenticated;

CREATE TRIGGER create_profile_after_auth_user_insert
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION private.create_profile_for_auth_user ();

CREATE FUNCTION private.maintain_updated_at ()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SET search_path = public, pg_temp
    AS $$
BEGIN
    IF to_jsonb (NEW) - 'updated_at' IS DISTINCT FROM to_jsonb (OLD) - 'updated_at' THEN
        NEW.updated_at := now();
    ELSE
        NEW.updated_at := OLD.updated_at;
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION private.maintain_updated_at () IS 'Updates updated_at when application-owned columns change.';

REVOKE EXECUTE ON FUNCTION private.maintain_updated_at () FROM public, anon, authenticated;

-- ============================================================================
-- Step 4: Add profile RLS policies and profile timestamp trigger.
-- ============================================================================
CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid ()) = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT TO authenticated
        USING (private.is_admin ());

CREATE POLICY "Users can create their own customer profile" ON public.profiles
    FOR INSERT TO authenticated
        WITH CHECK ((
            SELECT
                auth.uid ()) = id
                AND app_role = 'customer');

CREATE POLICY "Users can update their own profile display fields" ON public.profiles
    FOR UPDATE TO authenticated
        USING ((
            SELECT
                auth.uid ()) = id)
            WITH CHECK ((
                SELECT
                    auth.uid ()) = id);

GRANT SELECT ON TABLE public.profiles TO authenticated, service_role;

GRANT INSERT (id, display_name, updated_at) ON TABLE public.profiles TO authenticated;

GRANT UPDATE (display_name, updated_at) ON TABLE public.profiles TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.profiles TO service_role;

CREATE TRIGGER maintain_profile_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();

-- ============================================================================
-- Step 5: Create catalog categories and required reference rows.
-- ============================================================================
CREATE TABLE public.categories (
    slug text PRIMARY KEY,
    label text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT categories_slug_format_check CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT categories_label_length_check CHECK (char_length(btrim(label)) BETWEEN 1 AND 80)
);

COMMENT ON TABLE public.categories IS 'Catalog categories used to organize Onesbryne pieces.';

COMMENT ON COLUMN public.categories.slug IS 'Stable category identifier used in URLs, filters, and piece records.';

COMMENT ON COLUMN public.categories.sort_order IS 'Admin-controlled display order for category filters.';

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active categories are readable by everyone" ON public.categories
    FOR SELECT TO anon, authenticated
        USING (is_active);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL TO authenticated
        USING (private.is_admin ())
        WITH CHECK (private.is_admin ());

GRANT SELECT ON TABLE public.categories TO anon, authenticated, service_role;

GRANT INSERT (slug, label, sort_order, is_active, updated_at) ON TABLE public.categories TO authenticated;

GRANT UPDATE (label, sort_order, is_active, updated_at) ON TABLE public.categories TO authenticated;

GRANT DELETE ON TABLE public.categories TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO service_role;

CREATE INDEX categories_active_sort_idx ON public.categories (is_active, sort_order, label);

CREATE TRIGGER maintain_category_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();

INSERT INTO public.categories (slug, label, sort_order)
    VALUES ('outerwear', 'Outerwear', 10),
    ('dresses', 'Dresses', 20),
    ('knitwear', 'Knitwear', 30),
    ('trousers', 'Trousers', 40),
    ('skirts', 'Skirts', 50),
    ('shirts', 'Shirts', 60),
    ('shoes', 'Shoes', 70),
    ('accessories', 'Accessories', 80)
ON CONFLICT (slug)
    DO UPDATE SET
        label = EXCLUDED.label,
        sort_order = EXCLUDED.sort_order,
        is_active = TRUE,
        updated_at = now();

-- ============================================================================
-- Step 6: Create catalog pieces.
-- ============================================================================
CREATE TABLE public.pieces (
    id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid (),
    code_number integer GENERATED BY DEFAULT AS IDENTITY,
    code text GENERATED ALWAYS AS ('OB-' || lpad(code_number::text, 3, '0')) STORED,
    name text NOT NULL,
    brand text,
    category_slug text NOT NULL REFERENCES public.categories (slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    size_label text NOT NULL,
    condition_label text,
    price_cents integer NOT NULL,
    currency_code text NOT NULL DEFAULT 'EUR',
    description text NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    sold_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT pieces_code_number_positive_check CHECK (code_number > 0),
    CONSTRAINT pieces_code_number_unique UNIQUE (code_number),
    CONSTRAINT pieces_code_unique UNIQUE (code),
    CONSTRAINT pieces_name_length_check CHECK (char_length(btrim(name)) BETWEEN 1 AND 180),
    CONSTRAINT pieces_brand_length_check CHECK (brand IS NULL OR char_length(btrim(brand)) BETWEEN 1 AND 120),
    CONSTRAINT pieces_size_label_length_check CHECK (char_length(btrim(size_label)) BETWEEN 1 AND 40),
    CONSTRAINT pieces_condition_label_length_check CHECK (condition_label IS NULL OR char_length(btrim(condition_label)) BETWEEN 1 AND 80),
    CONSTRAINT pieces_price_cents_check CHECK (price_cents >= 0),
    CONSTRAINT pieces_currency_code_check CHECK (currency_code ~ '^[A-Z]{3}$'),
    CONSTRAINT pieces_description_length_check CHECK (char_length(btrim(description)) BETWEEN 1 AND 5000),
    CONSTRAINT pieces_status_check CHECK (status IN ('draft', 'available', 'reserved', 'sold', 'archived')),
    CONSTRAINT pieces_sold_at_status_check CHECK (sold_at IS NULL OR status = 'sold')
);

COMMENT ON TABLE public.pieces IS 'One-of-one clothing and accessory pieces in the Onesbryne catalog.';

COMMENT ON COLUMN public.pieces.code_number IS 'Internal numeric sequence for stable OB-### references.';

COMMENT ON COLUMN public.pieces.code IS 'Generated public catalog reference such as OB-001.';

COMMENT ON COLUMN public.pieces.price_cents IS 'Price stored in minor currency units to avoid decimal rounding issues.';

COMMENT ON COLUMN public.pieces.status IS 'Catalog lifecycle. Draft and archived pieces are admin-only.';

ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible pieces are readable by everyone" ON public.pieces
    FOR SELECT TO anon, authenticated
        USING (status IN ('available', 'reserved', 'sold'));

CREATE POLICY "Admins can manage pieces" ON public.pieces
    FOR ALL TO authenticated
        USING (private.is_admin ())
        WITH CHECK (private.is_admin ());

GRANT SELECT ON TABLE public.pieces TO anon, authenticated, service_role;

GRANT INSERT (name, brand, category_slug, size_label, condition_label, price_cents, currency_code, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;

GRANT UPDATE (name, brand, category_slug, size_label, condition_label, price_cents, currency_code, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;

GRANT DELETE ON TABLE public.pieces TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.pieces TO service_role;

GRANT USAGE, SELECT ON SEQUENCE public.pieces_code_number_seq
    TO authenticated, service_role;

CREATE INDEX pieces_visible_created_idx ON public.pieces (status, created_at DESC)
WHERE
    status IN ('available', 'reserved', 'sold');

CREATE INDEX pieces_category_status_idx ON public.pieces (category_slug, status, created_at DESC);

CREATE INDEX pieces_price_idx ON public.pieces (price_cents);

CREATE TRIGGER maintain_piece_updated_at
    BEFORE UPDATE ON public.pieces
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();

-- ============================================================================
-- Step 7: Create image metadata for optimized Storage objects.
-- ============================================================================
CREATE TABLE public.piece_images (
    id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid (),
    piece_id uuid NOT NULL REFERENCES public.pieces (id) ON DELETE CASCADE,
    storage_bucket text NOT NULL DEFAULT 'piece-images',
    storage_path text NOT NULL,
    alt_text text,
    position integer NOT NULL DEFAULT 0,
    width integer,
    height integer,
    byte_size integer,
    mime_type text NOT NULL DEFAULT 'image/webp',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT piece_images_bucket_check CHECK (storage_bucket = 'piece-images'),
    CONSTRAINT piece_images_storage_path_unique UNIQUE (storage_path),
    CONSTRAINT piece_images_piece_position_unique UNIQUE (piece_id, position),
    CONSTRAINT piece_images_storage_path_length_check CHECK (char_length(storage_path) BETWEEN 1 AND 1024),
    CONSTRAINT piece_images_storage_path_prefix_check CHECK (storage_path LIKE 'pieces/%' AND storage_path NOT LIKE '%..%'),
    CONSTRAINT piece_images_alt_text_length_check CHECK (alt_text IS NULL OR char_length(btrim(alt_text)) BETWEEN 1 AND 180),
    CONSTRAINT piece_images_position_check CHECK (position >= 0),
    CONSTRAINT piece_images_width_check CHECK (width IS NULL OR width BETWEEN 1 AND 6000),
    CONSTRAINT piece_images_height_check CHECK (height IS NULL OR height BETWEEN 1 AND 6000),
    CONSTRAINT piece_images_byte_size_check CHECK (byte_size IS NULL OR byte_size BETWEEN 1 AND 3145728),
    CONSTRAINT piece_images_mime_type_check CHECK (mime_type IN ('image/webp', 'image/jpeg'))
);

COMMENT ON TABLE public.piece_images IS 'Storage object metadata for optimized Onesbryne catalog photos.';

COMMENT ON COLUMN public.piece_images.storage_path IS 'Path inside the piece-images bucket, normally pieces/<piece-id>/<image-id>.webp.';

COMMENT ON COLUMN public.piece_images.byte_size IS 'Optimized upload size in bytes. Originals should not be stored.';

ALTER TABLE public.piece_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible piece images are readable by everyone" ON public.piece_images
    FOR SELECT TO anon, authenticated
        USING (EXISTS (
            SELECT
                1
            FROM
                public.pieces piece
            WHERE
                piece.id = piece_images.piece_id AND piece.status IN ('available', 'reserved', 'sold')));

CREATE POLICY "Admins can manage piece images" ON public.piece_images
    FOR ALL TO authenticated
        USING (private.is_admin ())
        WITH CHECK (private.is_admin ());

GRANT SELECT ON TABLE public.piece_images TO anon, authenticated, service_role;

GRANT INSERT (piece_id, storage_bucket, storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT UPDATE (storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT DELETE ON TABLE public.piece_images TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.piece_images TO service_role;

CREATE INDEX piece_images_piece_position_idx ON public.piece_images (piece_id, position);

CREATE TRIGGER maintain_piece_image_updated_at
    BEFORE UPDATE ON public.piece_images
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();

-- ============================================================================
-- Step 8: Create favourites.
-- ============================================================================
CREATE TABLE public.favourites (
    user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    piece_id uuid NOT NULL REFERENCES public.pieces (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, piece_id)
);

COMMENT ON TABLE public.favourites IS 'Pieces saved by authenticated Onesbryne customers.';

COMMENT ON COLUMN public.favourites.user_id IS 'Favourite owner. Matches auth.uid().';

ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own favourites" ON public.favourites
    FOR SELECT TO authenticated
        USING ((
            SELECT
                auth.uid ()) = user_id);

CREATE POLICY "Users can save visible pieces" ON public.favourites
    FOR INSERT TO authenticated
        WITH CHECK ((
            SELECT
                auth.uid ()) = user_id
                AND EXISTS (
                    SELECT
                        1
                    FROM
                        public.pieces piece
                    WHERE
                        piece.id = favourites.piece_id AND piece.status IN ('available', 'reserved', 'sold')));

CREATE POLICY "Users can delete their own favourites" ON public.favourites
    FOR DELETE TO authenticated
        USING ((
            SELECT
                auth.uid ()) = user_id);

GRANT SELECT ON TABLE public.favourites TO authenticated, service_role;

GRANT INSERT (user_id, piece_id) ON TABLE public.favourites TO authenticated;

GRANT DELETE ON TABLE public.favourites TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.favourites TO service_role;

CREATE INDEX favourites_piece_idx ON public.favourites (piece_id);

CREATE INDEX favourites_user_created_idx ON public.favourites (user_id, created_at DESC);

-- ============================================================================
-- Step 9: Create the public catalog image bucket and admin-only write policies.
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('piece-images', 'piece-images', TRUE, 3145728, ARRAY['image/webp', 'image/jpeg']::text[])
ON CONFLICT (id)
    DO UPDATE SET
        name = EXCLUDED.name,
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Admins can read piece image objects" ON storage.objects
    FOR SELECT TO authenticated
        USING (bucket_id = 'piece-images'
            AND private.is_admin ());

CREATE POLICY "Admins can upload piece image objects" ON storage.objects
    FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'piece-images'
        AND (storage.foldername (name))[1] = 'pieces'
        AND private.is_admin ());

CREATE POLICY "Admins can update piece image objects" ON storage.objects
    FOR UPDATE TO authenticated
        USING (bucket_id = 'piece-images'
            AND private.is_admin ())
            WITH CHECK (bucket_id = 'piece-images'
            AND (storage.foldername (name))[1] = 'pieces'
            AND private.is_admin ());

CREATE POLICY "Admins can delete piece image objects" ON storage.objects
    FOR DELETE TO authenticated
        USING (bucket_id = 'piece-images'
            AND private.is_admin ());
