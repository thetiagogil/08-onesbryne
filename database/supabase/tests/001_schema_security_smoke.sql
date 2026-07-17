CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

BEGIN;
SET LOCAL search_path = extensions, public;
SELECT
    plan (16);
SELECT
    has_schema ('private', 'private schema exists');
SELECT
    has_table ('public', 'profiles', 'profiles table exists');
SELECT
    has_table ('public', 'categories', 'categories table exists');
SELECT
    has_table ('public', 'category_size_options', 'category size options table exists');
SELECT
    has_table ('public', 'pieces', 'pieces table exists');
SELECT
    has_table ('public', 'piece_images', 'piece images table exists');
SELECT
    has_table ('public', 'favourites', 'favourites table exists');
SELECT
    ok (NOT EXISTS (
            SELECT
                1
            FROM
                pg_catalog.pg_class AS relation
                INNER JOIN pg_catalog.pg_namespace AS namespace ON namespace.oid = relation.relnamespace
            WHERE
                relation.relkind = 'r'
                AND namespace.nspname = 'public'
                AND relation.relname IN ('profiles', 'categories', 'category_size_options', 'pieces', 'piece_images', 'favourites')
                AND NOT relation.relrowsecurity),
            'all app-facing Onesbryne tables have row-level security enabled');
SELECT
    ok (NOT EXISTS (
            SELECT
                1
            FROM
                pg_catalog.pg_class AS relation
                INNER JOIN pg_catalog.pg_namespace AS namespace ON namespace.oid = relation.relnamespace
                CROSS JOIN (
                    VALUES ('INSERT'),
                        ('UPDATE'),
                        ('DELETE'),
                        ('TRUNCATE')) AS write_privileges (privilege_name)
                WHERE
                    relation.relkind = 'r'
                        AND namespace.nspname = 'public'
                        AND relation.relname IN ('profiles', 'categories', 'category_size_options', 'pieces', 'piece_images', 'favourites')
                        AND has_table_privilege('anon', relation.oid, write_privileges.privilege_name)),
                    'anonymous users have no write privileges on app tables');
SELECT
    ok (NOT has_function_privilege('anon', 'private.is_admin()', 'EXECUTE'),
        'anonymous users cannot execute the private admin check');
SELECT
    ok (has_function_privilege('authenticated', 'private.is_admin()', 'EXECUTE'),
        'authenticated users can execute the RLS admin check');
SELECT
    policies_are ('public', 'profiles', ARRAY['Users can read their own profile', 'Admins can read all profiles', 'Users can create their own customer profile', 'Users can update their own profile display fields']);
SELECT
    policies_are ('public', 'pieces', ARRAY['Visible pieces are readable by everyone', 'Admins can manage pieces']);
SELECT
    policies_are ('public', 'favourites', ARRAY['Users can read their own favourites', 'Users can save visible pieces', 'Users can delete their own favourites']);
SELECT
    policies_are ('storage', 'objects', ARRAY['Admins can read piece image objects', 'Admins can upload piece image objects', 'Admins can update piece image objects', 'Admins can delete piece image objects']);
SELECT
    ok (EXISTS (
            SELECT
                1
            FROM
                storage.buckets
            WHERE
                id = 'piece-images'
                AND public
                AND file_size_limit = 3145728
                AND allowed_mime_types @> ARRAY['image/webp', 'image/jpeg']::text[]),
            'piece image bucket keeps its public-read and upload constraints');
SELECT
    *
FROM
    finish ();
ROLLBACK;
