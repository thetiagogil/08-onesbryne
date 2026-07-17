-- ============================================================================
-- Private Auth And Maintenance Functions
-- Database-owned helpers for profiles, admin checks, and timestamps.
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
