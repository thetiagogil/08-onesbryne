-- ============================================================================
-- Categories
-- Curated catalog categories shown in filters and admin tools.
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

REVOKE ALL ON TABLE public.categories FROM anon, authenticated;

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
VALUES
    ('outerwear', 'Outerwear', 10),
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
