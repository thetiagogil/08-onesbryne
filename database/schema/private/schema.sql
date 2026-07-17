-- ============================================================================
-- Private Schema
-- Helper functions that must not be exposed through the Data API.
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS private;

COMMENT ON SCHEMA private IS 'Private helper functions for Onesbryne. This schema must not be exposed through the Data API.';

REVOKE ALL ON SCHEMA private FROM public;
