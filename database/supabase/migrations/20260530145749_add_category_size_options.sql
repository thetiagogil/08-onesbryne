-- ============================================================================
-- Onesbryne Category Size Options
-- Defines valid size sets per catalog category and enforces category/size pairs
-- on pieces.
-- ============================================================================
CREATE TABLE public.category_size_options (
    category_slug text NOT NULL REFERENCES public.categories (slug) ON UPDATE CASCADE ON DELETE CASCADE,
    size public.piece_size NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (category_slug, size),
    CONSTRAINT category_size_options_sort_order_check CHECK (sort_order >= 0)
);

COMMENT ON TABLE public.category_size_options IS 'Allowed size options per Onesbryne catalog category.';

COMMENT ON COLUMN public.category_size_options.category_slug IS 'Category the size option belongs to.';

COMMENT ON COLUMN public.category_size_options.size IS 'Canonical piece size allowed for this category.';

COMMENT ON COLUMN public.category_size_options.sort_order IS 'Display order for size options inside the category.';

ALTER TABLE public.category_size_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category size options are readable by everyone" ON public.category_size_options
    FOR SELECT
    TO anon, authenticated
        USING (TRUE);

CREATE POLICY "Admins can manage category size options" ON public.category_size_options
    FOR ALL
    TO authenticated
        USING (private.is_admin())
        WITH CHECK (private.is_admin());

GRANT SELECT ON TABLE public.category_size_options TO anon, authenticated, service_role;

GRANT INSERT (category_slug, size, sort_order, updated_at) ON TABLE public.category_size_options TO authenticated;

GRANT UPDATE (sort_order, updated_at) ON TABLE public.category_size_options TO authenticated;

GRANT DELETE ON TABLE public.category_size_options TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.category_size_options TO service_role;

CREATE INDEX category_size_options_category_sort_idx ON public.category_size_options (category_slug, sort_order, size);

CREATE TRIGGER maintain_category_size_options_updated_at
    BEFORE UPDATE ON public.category_size_options
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();

INSERT INTO public.category_size_options (category_slug, size, sort_order)
    VALUES ('outerwear', 'xxs', 10),
    ('outerwear', 'xs', 20),
    ('outerwear', 's', 30),
    ('outerwear', 'm', 40),
    ('outerwear', 'l', 50),
    ('outerwear', 'xl', 60),
    ('outerwear', 'xxl', 70),
    ('dresses', 'xxs', 10),
    ('dresses', 'xs', 20),
    ('dresses', 's', 30),
    ('dresses', 'm', 40),
    ('dresses', 'l', 50),
    ('dresses', 'xl', 60),
    ('dresses', 'xxl', 70),
    ('knitwear', 'xxs', 10),
    ('knitwear', 'xs', 20),
    ('knitwear', 's', 30),
    ('knitwear', 'm', 40),
    ('knitwear', 'l', 50),
    ('knitwear', 'xl', 60),
    ('knitwear', 'xxl', 70),
    ('trousers', 'w24', 10),
    ('trousers', 'w25', 20),
    ('trousers', 'w26', 30),
    ('trousers', 'w27', 40),
    ('trousers', 'w28', 50),
    ('trousers', 'w29', 60),
    ('trousers', 'w30', 70),
    ('trousers', 'w31', 80),
    ('trousers', 'w32', 90),
    ('trousers', 'w33', 100),
    ('trousers', 'w34', 110),
    ('trousers', 'eu_35', 120),
    ('trousers', 'eu_36', 130),
    ('trousers', 'eu_37', 140),
    ('trousers', 'eu_38', 150),
    ('trousers', 'eu_39', 160),
    ('trousers', 'eu_40', 170),
    ('trousers', 'eu_41', 180),
    ('trousers', 'eu_42', 190),
    ('skirts', 'xxs', 10),
    ('skirts', 'xs', 20),
    ('skirts', 's', 30),
    ('skirts', 'm', 40),
    ('skirts', 'l', 50),
    ('skirts', 'xl', 60),
    ('skirts', 'xxl', 70),
    ('shirts', 'xxs', 10),
    ('shirts', 'xs', 20),
    ('shirts', 's', 30),
    ('shirts', 'm', 40),
    ('shirts', 'l', 50),
    ('shirts', 'xl', 60),
    ('shirts', 'xxl', 70),
    ('shoes', 'eu_35', 10),
    ('shoes', 'eu_36', 20),
    ('shoes', 'eu_37', 30),
    ('shoes', 'eu_38', 40),
    ('shoes', 'eu_39', 50),
    ('shoes', 'eu_40', 60),
    ('shoes', 'eu_41', 70),
    ('shoes', 'eu_42', 80),
    ('accessories', 'one_size', 10)
ON CONFLICT (category_slug, size)
    DO UPDATE SET
        sort_order = EXCLUDED.sort_order,
        updated_at = now();

ALTER TABLE public.pieces
    ADD CONSTRAINT pieces_category_size_allowed_fkey FOREIGN KEY (category_slug, size_label) REFERENCES public.category_size_options (category_slug, size) ON UPDATE CASCADE;
