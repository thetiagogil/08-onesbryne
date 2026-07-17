-- ============================================================================
-- Profiles
-- App profile and role data linked one-to-one with Supabase Auth users.
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

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

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
