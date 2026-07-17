-- ============================================================================
-- Public Schema
-- App-facing tables exposed through the Data API with explicit grants and RLS.
-- ============================================================================
COMMENT ON SCHEMA public IS 'Onesbryne app-facing catalog and profile data.';

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
