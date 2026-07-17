CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

BEGIN;
SET LOCAL search_path = extensions, public;
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000a1', 'authenticated', 'authenticated', 'favourites-a@example.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()), ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000b2', 'authenticated', 'authenticated', 'favourites-b@example.test', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW());
INSERT INTO public.pieces (id, code_number, name, category_slug, size_label, condition_label, price_cents, description, status, published_at)
VALUES
    ('20000000-0000-0000-0000-0000000000a1', 911, 'pgTAP Favourite Piece A', 'outerwear', 's', 'excellent', 10000, 'First favourite fixture.', 'available', NOW()),
    ('20000000-0000-0000-0000-0000000000b2', 912, 'pgTAP Favourite Piece B', 'outerwear', 's', 'excellent', 12000, 'Second favourite fixture.', 'available', NOW());
INSERT INTO public.favourites (user_id, piece_id)
    VALUES ('00000000-0000-0000-0000-0000000000b2', '20000000-0000-0000-0000-0000000000b2');
SELECT
    plan (10);
SELECT
    set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', TRUE);
SET LOCAL ROLE authenticated;
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.profiles),
            1::bigint,
            'a customer sees only their own profile');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.profiles
            WHERE
                id = '00000000-0000-0000-0000-0000000000b2'), 0::bigint, 'a customer cannot read another profile');
SELECT
    lives_ok ($$ UPDATE
            public.profiles
        SET
            display_name = 'Customer A'
            WHERE
                id = '00000000-0000-0000-0000-0000000000a1' $$, 'a customer can update their own display name');
SELECT
    results_eq ($$ WITH changed AS ( UPDATE
                public.profiles
            SET
                display_name = 'Forbidden'
                WHERE
                    id = '00000000-0000-0000-0000-0000000000b2'
                RETURNING
                    1)
                SELECT
                    COUNT(*)
                    FROM changed $$, $$
                VALUES (0::bigint) $$, 'a customer cannot update another profile');
SELECT
    lives_ok ($$ INSERT INTO public.favourites (user_id, piece_id)
            VALUES ('00000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1') $$, 'a customer can save a visible piece for themselves');
SELECT
    IS ((
            SELECT
                COUNT(*)
            FROM
                public.favourites),
            1::bigint,
            'a customer sees only their own favourites');
SELECT
    throws_ok ($$ INSERT INTO public.favourites (user_id, piece_id)
            VALUES ('00000000-0000-0000-0000-0000000000b2', '20000000-0000-0000-0000-0000000000a1') $$, '42501', 'new row violates row-level security policy for table "favourites"', 'a customer cannot save a piece for another user');
SELECT
    results_eq ($$ WITH removed AS ( DELETE FROM public.favourites
            WHERE user_id = '00000000-0000-0000-0000-0000000000b2'
            RETURNING
                1)
            SELECT
                COUNT(*)
                FROM removed $$, $$
            VALUES (0::bigint) $$, 'a customer cannot delete another user favourite');
SELECT
    ok (NOT has_column_privilege('authenticated', 'public.profiles', 'app_role', 'UPDATE'),
        'customers cannot promote their own app role');
SELECT
    IS ((
            SELECT
                display_name
            FROM
                public.profiles
            WHERE
                id = '00000000-0000-0000-0000-0000000000a1'), 'Customer A'::text, 'the allowed profile update persists inside the transaction');
RESET ROLE;
SELECT
    *
FROM
    finish ();
ROLLBACK;
