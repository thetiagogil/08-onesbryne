-- ============================================================================
-- Piece Images Storage
-- Public catalog image bucket with admin-only write access.
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('piece-images', 'piece-images', TRUE, 3145728, ARRAY['image/webp', 'image/jpeg']::text[])
ON CONFLICT (id)
    DO UPDATE SET
        name = EXCLUDED.name,
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Admins can read piece image objects" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'piece-images'
        AND private.is_admin ());

CREATE POLICY "Admins can upload piece image objects" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'piece-images'
    AND (storage.foldername (name))[1] = 'pieces'
    AND private.is_admin ());

CREATE POLICY "Admins can update piece image objects" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'piece-images'
        AND private.is_admin ())
    WITH CHECK (bucket_id = 'piece-images'
    AND (storage.foldername (name))[1] = 'pieces'
    AND private.is_admin ());

CREATE POLICY "Admins can delete piece image objects" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'piece-images'
        AND private.is_admin ());
