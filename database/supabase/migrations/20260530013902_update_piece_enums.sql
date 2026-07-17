-- ============================================================================
-- Onesbryne Piece Enums
-- Converts free-text size/condition values to generated enum contracts and
-- removes the single-currency column from pieces.
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

DO $$
DECLARE
    invalid_sizes text[];
    invalid_conditions text[];
BEGIN
    SELECT
        array_agg(DISTINCT size_label) INTO invalid_sizes
    FROM
        public.pieces
    WHERE
        size_label NOT IN ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One size', 'EU 35', 'EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'W24', 'W25', 'W26', 'W27', 'W28', 'W29', 'W30', 'W31', 'W32', 'W33', 'W34');
    IF invalid_sizes IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot convert public.pieces.size_label values to public.piece_size: %', invalid_sizes;
    END IF;
    SELECT
        array_agg(DISTINCT condition_label) INTO invalid_conditions
    FROM
        public.pieces
    WHERE
        condition_label IS NOT NULL
        AND condition_label NOT IN ('New with tags', 'Excellent', 'Very good', 'Good', 'Light wear', 'Visible wear');
    IF invalid_conditions IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot convert public.pieces.condition_label values to public.piece_condition: %', invalid_conditions;
    END IF;
END
$$;

ALTER TABLE public.pieces
    DROP CONSTRAINT pieces_size_label_length_check,
    DROP CONSTRAINT pieces_condition_label_length_check,
    DROP CONSTRAINT pieces_currency_code_check;

ALTER TABLE public.pieces
    ALTER COLUMN size_label TYPE public.piece_size
    USING (
        CASE size_label
        WHEN 'XXS' THEN
            'xxs'
        WHEN 'XS' THEN
            'xs'
        WHEN 'S' THEN
            's'
        WHEN 'M' THEN
            'm'
        WHEN 'L' THEN
            'l'
        WHEN 'XL' THEN
            'xl'
        WHEN 'XXL' THEN
            'xxl'
        WHEN 'One size' THEN
            'one_size'
        WHEN 'EU 35' THEN
            'eu_35'
        WHEN 'EU 36' THEN
            'eu_36'
        WHEN 'EU 37' THEN
            'eu_37'
        WHEN 'EU 38' THEN
            'eu_38'
        WHEN 'EU 39' THEN
            'eu_39'
        WHEN 'EU 40' THEN
            'eu_40'
        WHEN 'EU 41' THEN
            'eu_41'
        WHEN 'EU 42' THEN
            'eu_42'
        WHEN 'W24' THEN
            'w24'
        WHEN 'W25' THEN
            'w25'
        WHEN 'W26' THEN
            'w26'
        WHEN 'W27' THEN
            'w27'
        WHEN 'W28' THEN
            'w28'
        WHEN 'W29' THEN
            'w29'
        WHEN 'W30' THEN
            'w30'
        WHEN 'W31' THEN
            'w31'
        WHEN 'W32' THEN
            'w32'
        WHEN 'W33' THEN
            'w33'
        WHEN 'W34' THEN
            'w34'
        END::public.piece_size),
        ALTER COLUMN condition_label TYPE public.piece_condition
        USING (
            CASE WHEN condition_label IS NULL THEN
                NULL
            WHEN condition_label = 'New with tags' THEN
                'new_with_tags'
            WHEN condition_label = 'Excellent' THEN
                'excellent'
            WHEN condition_label = 'Very good' THEN
                'very_good'
            WHEN condition_label = 'Good' THEN
                'good'
            WHEN condition_label = 'Light wear' THEN
                'light_wear'
            WHEN condition_label = 'Visible wear' THEN
                'visible_wear'
            END::public.piece_condition),
            DROP COLUMN currency_code;

COMMENT ON COLUMN public.pieces.size_label IS 'Canonical size enum code. The frontend maps this to a display label.';

COMMENT ON COLUMN public.pieces.condition_label IS 'Canonical condition enum code. The frontend maps this to a display label.';

GRANT INSERT (name, brand, category_slug, size_label, condition_label, price_cents, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;

GRANT UPDATE (name, brand, category_slug, size_label, condition_label, price_cents, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;
