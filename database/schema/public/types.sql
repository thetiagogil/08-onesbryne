-- ============================================================================
-- Public Types
-- Shared enum contracts consumed by Onesbryne frontend code through generated
-- Supabase database types.
-- ============================================================================
CREATE TYPE public.piece_size AS ENUM (
    'xxs',
    'xs',
    's',
    'm',
    'l',
    'xl',
    'xxl',
    'one_size',
    'eu_35',
    'eu_36',
    'eu_37',
    'eu_38',
    'eu_39',
    'eu_40',
    'eu_41',
    'eu_42',
    'w24',
    'w25',
    'w26',
    'w27',
    'w28',
    'w29',
    'w30',
    'w31',
    'w32',
    'w33',
    'w34'
);

COMMENT ON TYPE public.piece_size IS 'Canonical size codes for Onesbryne catalog pieces. The frontend owns display labels.';

CREATE TYPE public.piece_condition AS ENUM (
    'new_with_tags',
    'excellent',
    'very_good',
    'good',
    'light_wear',
    'visible_wear'
);

COMMENT ON TYPE public.piece_condition IS 'Canonical condition codes for Onesbryne catalog pieces. The frontend owns display labels.';

GRANT USAGE ON TYPE public.piece_size TO anon, authenticated, service_role;

GRANT USAGE ON TYPE public.piece_condition TO anon, authenticated, service_role;
