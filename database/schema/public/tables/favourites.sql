-- ============================================================================
-- Favourites
-- Customer-saved pieces.
-- ============================================================================
CREATE TABLE public.favourites (
    user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    piece_id uuid NOT NULL REFERENCES public.pieces (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, piece_id)
);

COMMENT ON TABLE public.favourites IS 'Pieces saved by authenticated Onesbryne customers.';

COMMENT ON COLUMN public.favourites.user_id IS 'Favourite owner. Matches auth.uid().';

ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own favourites" ON public.favourites
    FOR SELECT TO authenticated
    USING ((
        SELECT
            auth.uid ()) = user_id);

CREATE POLICY "Users can save visible pieces" ON public.favourites
    FOR INSERT TO authenticated
    WITH CHECK ((
        SELECT
            auth.uid ()) = user_id
            AND EXISTS (
                SELECT
                    1
                FROM
                    public.pieces piece
                WHERE
                    piece.id = favourites.piece_id
                    AND piece.status IN ('available', 'reserved', 'sold')));

CREATE POLICY "Users can delete their own favourites" ON public.favourites
    FOR DELETE TO authenticated
    USING ((
        SELECT
            auth.uid ()) = user_id);

GRANT SELECT ON TABLE public.favourites TO authenticated, service_role;

GRANT INSERT (user_id, piece_id) ON TABLE public.favourites TO authenticated;

GRANT DELETE ON TABLE public.favourites TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.favourites TO service_role;

CREATE INDEX favourites_piece_idx ON public.favourites (piece_id);

CREATE INDEX favourites_user_created_idx ON public.favourites (user_id, created_at DESC);
