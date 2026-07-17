CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

BEGIN;
SET LOCAL search_path = extensions, public;
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000a1', 'authenticated', 'authenticated', 'catalog-customer@example.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()), ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000b2', 'authenticated', 'authenticated', 'catalog-admin@example.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW());
UPDATE
    public.profiles
SET
    app_role = 'admin'
WHERE
    id = '00000000-0000-0000-0000-0000000000b2';
INSERT INTO public.pieces (id, code_number, name, category_slug, size_label, condition_label, price_cents, description, status, published_at)
VALUES
    ('10000000-0000-0000-0000-0000000000a1', 901, 'pgTAP Visible Piece', 'outerwear', 's', 'excellent', 10000, 'Visible catalog fixture.', 'available', NOW()),
    ('10000000-0000-0000-0000-0000000000b2', 902, 'pgTAP Draft Piece', 'outerwear', 's', 'excellent', 12000, 'Draft catalog fixture.', 'draft', NULL);
INSERT INTO public.piece_images (id, piece_id, storage_path, position)
VALUES
    ('11000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'pieces/tests/visible.webp', 0),
    ('11000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000b2', 'pieces/tests/draft.webp', 0);
SELECT
    plan (11);
SET LOCAL ROLE anon;
SELECT
    ok (EXISTS (
            SELECT
                1
            FROM
                public.categories
            WHERE
                slug = 'outerwear'), 'anonymous users can read active categories');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.pieces
            WHERE
                id IN ('10000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000b2')),
            1::bigint,
            'anonymous users see visible pieces but not drafts');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.piece_images
            WHERE
                id IN ('11000000-0000-0000-0000-0000000000a1', '11000000-0000-0000-0000-0000000000b2')),
            1::bigint,
            'anonymous users see images only for visible pieces');
SELECT
    throws_ok ($$ INSERT INTO public.pieces (name, category_slug, size_label, price_cents, description, status)
            VALUES ('Forbidden', 'outerwear', 's', 1000, 'Forbidden anonymous insert.', 'available') $$, '42501', 'permission denied for table pieces', 'anonymous users cannot create pieces');
RESET ROLE;
SELECT
    set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', TRUE);
SET LOCAL ROLE authenticated;
SELECT
    throws_ok ($$
        SELECT
            private.is_admin () $$, '42501', 'permission denied for schema private', 'customers cannot call private authorization helpers directly');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.pieces
            WHERE
                id IN ('10000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000b2')),
            1::bigint,
            'customers see visible pieces but not drafts');
SELECT
    throws_ok ($$ INSERT INTO public.pieces (name, category_slug, size_label, price_cents, description, status)
            VALUES ('Forbidden', 'outerwear', 's', 1000, 'Forbidden customer insert.', 'draft') $$, '42501', 'new row violates row-level security policy for table "pieces"', 'customers cannot create draft pieces');
SELECT
    results_eq ($$ WITH changed AS ( UPDATE
                public.pieces
            SET
                name = 'Forbidden'
                WHERE
                    id = '10000000-0000-0000-0000-0000000000a1'
                RETURNING
                    1)
                SELECT
                    COUNT(*)
                    FROM changed $$, $$
                VALUES (0::bigint) $$, 'customers cannot update catalog pieces');
RESET ROLE;
SELECT
    set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b2', TRUE);
SET LOCAL ROLE authenticated;
SELECT
    lives_ok ($$ UPDATE
            public.pieces
        SET
            name = 'pgTAP Admin Updated Piece'
            WHERE
                id = '10000000-0000-0000-0000-0000000000a1' $$, 'admin policies permit catalog updates without exposing private helpers');
SELECT
    lives_ok ($$ INSERT INTO public.pieces (name, category_slug, size_label, price_cents, description, status)
            VALUES ('pgTAP Admin Draft', 'outerwear', 's', 15000, 'Admin-created draft fixture.', 'draft') $$, 'admins can create draft pieces');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.pieces
            WHERE
                name IN ('pgTAP Draft Piece', 'pgTAP Admin Draft')),
            2::bigint,
            'admins can read draft pieces');
RESET ROLE;
SELECT
    *
FROM
    finish ();
ROLLBACK;
