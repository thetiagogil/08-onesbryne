-- Enforce the least-privilege client grants described by the current-state
-- schema. Supabase grants broad table privileges to API roles by default, so
-- column-level grants are not restrictive until those defaults are revoked.

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

REVOKE ALL ON TABLE public.categories FROM anon, authenticated;

REVOKE ALL ON TABLE public.category_size_options FROM anon, authenticated;

REVOKE ALL ON TABLE public.pieces FROM anon, authenticated;

REVOKE ALL ON TABLE public.piece_images FROM anon, authenticated;

REVOKE ALL ON TABLE public.favourites FROM anon, authenticated;

REVOKE ALL ON SEQUENCE public.pieces_code_number_seq FROM anon, authenticated;

GRANT SELECT ON TABLE public.profiles TO authenticated;

GRANT INSERT (id, display_name, updated_at) ON TABLE public.profiles TO authenticated;

GRANT UPDATE (display_name, updated_at) ON TABLE public.profiles TO authenticated;

GRANT SELECT ON TABLE public.categories TO anon, authenticated;

GRANT INSERT (slug, label, sort_order, is_active, updated_at) ON TABLE public.categories TO authenticated;

GRANT UPDATE (label, sort_order, is_active, updated_at) ON TABLE public.categories TO authenticated;

GRANT DELETE ON TABLE public.categories TO authenticated;

GRANT SELECT ON TABLE public.category_size_options TO anon, authenticated;

GRANT INSERT (category_slug, size, sort_order, updated_at) ON TABLE public.category_size_options TO authenticated;

GRANT UPDATE (sort_order, updated_at) ON TABLE public.category_size_options TO authenticated;

GRANT DELETE ON TABLE public.category_size_options TO authenticated;

GRANT SELECT ON TABLE public.pieces TO anon, authenticated;

GRANT INSERT (name, brand, category_slug, size_label, condition_label, price_cents, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;

GRANT UPDATE (name, brand, category_slug, size_label, condition_label, price_cents, description, status, published_at, sold_at, updated_at) ON TABLE public.pieces TO authenticated;

GRANT DELETE ON TABLE public.pieces TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE public.pieces_code_number_seq TO authenticated;

GRANT SELECT ON TABLE public.piece_images TO anon, authenticated;

GRANT INSERT (piece_id, storage_bucket, storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT UPDATE (storage_path, alt_text, position, width, height, byte_size, mime_type, updated_at) ON TABLE public.piece_images TO authenticated;

GRANT DELETE ON TABLE public.piece_images TO authenticated;

GRANT SELECT ON TABLE public.favourites TO authenticated;

GRANT INSERT (user_id, piece_id) ON TABLE public.favourites TO authenticated;

GRANT DELETE ON TABLE public.favourites TO authenticated;
