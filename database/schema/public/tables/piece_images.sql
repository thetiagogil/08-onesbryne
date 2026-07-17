-- ============================================================================
-- Piece Images
-- Metadata for optimized catalog images stored in Supabase Storage.
-- ============================================================================
CREATE TABLE public.piece_images (
    id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid (),
    piece_id uuid NOT NULL REFERENCES public.pieces (id) ON DELETE CASCADE,
    storage_bucket text NOT NULL DEFAULT 'piece-images',
    storage_path text NOT NULL,
    alt_text text,
    position integer NOT NULL DEFAULT 0,
    width integer,
    height integer,
    byte_size integer,
    mime_type text NOT NULL DEFAULT 'image/webp',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT piece_images_bucket_check CHECK (storage_bucket = 'piece-images'),
    CONSTRAINT piece_images_storage_path_unique UNIQUE (storage_path),
    CONSTRAINT piece_images_piece_position_unique UNIQUE (piece_id, position),
    CONSTRAINT piece_images_storage_path_length_check CHECK (char_length(storage_path) BETWEEN 1 AND 1024),
    CONSTRAINT piece_images_storage_path_prefix_check CHECK (storage_path LIKE 'pieces/%' AND storage_path NOT LIKE '%..%'),
    CONSTRAINT piece_images_alt_text_length_check CHECK (alt_text IS NULL OR char_length(btrim(alt_text)) BETWEEN 1 AND 180),
    CONSTRAINT piece_images_position_check CHECK (position >= 0),
    CONSTRAINT piece_images_width_check CHECK (width IS NULL OR width BETWEEN 1 AND 6000),
    CONSTRAINT piece_images_height_check CHECK (height IS NULL OR height BETWEEN 1 AND 6000),
    CONSTRAINT piece_images_byte_size_check CHECK (byte_size IS NULL OR byte_size BETWEEN 1 AND 3145728),
    CONSTRAINT piece_images_mime_type_check CHECK (mime_type IN ('image/webp', 'image/jpeg'))
);

COMMENT ON TABLE public.piece_images IS 'Storage object metadata for optimized Onesbryne catalog photos.';

COMMENT ON COLUMN public.piece_images.storage_path IS 'Path inside the piece-images bucket, normally pieces/<piece-id>/<image-id>.webp.';

COMMENT ON COLUMN public.piece_images.byte_size IS 'Optimized upload size in bytes. Originals should not be stored.';

ALTER TABLE public.piece_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible piece images are readable by everyone" ON public.piece_images
    FOR SELECT TO anon, authenticated
    USING (EXISTS (
        SELECT
            1
        FROM
            public.pieces piece
        WHERE
            piece.id = piece_images.piece_id
            AND piece.status IN ('available', 'reserved', 'sold')));

CREATE POLICY "Admins can manage piece images" ON public.piece_images
    FOR ALL TO authenticated
    USING (private.is_admin ())
    WITH CHECK (private.is_admin ());

GRANT SELECT ON TABLE public.piece_images TO anon, authenticated, service_role;

GRANT INSERT (piece_id, storage_bucket, storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT UPDATE (storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT DELETE ON TABLE public.piece_images TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE public.piece_images TO service_role;

CREATE INDEX piece_images_piece_position_idx ON public.piece_images (piece_id, position);

CREATE TRIGGER maintain_piece_image_updated_at
    BEFORE UPDATE ON public.piece_images
    FOR EACH ROW
    EXECUTE FUNCTION private.maintain_updated_at ();
