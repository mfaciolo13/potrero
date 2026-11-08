-- Buckets de Supabase Storage para avatares y fotos de lugares, con sus permisos.
-- El esquema storage solo existe en Supabase: donde no esta (base de sombra, pruebas locales) no se hace nada.
DO $$
DECLARE
  bucket text;
  own_folder text := '(storage.foldername(name))[1] = (select auth.uid())::text';
BEGIN
  IF to_regclass('storage.buckets') IS NULL OR to_regclass('storage.objects') IS NULL THEN
    RAISE NOTICE 'No existe el esquema storage, se omiten los buckets';
    RETURN;
  END IF;

  FOREACH bucket IN ARRAY ARRAY['avatars', 'places'] LOOP
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (bucket, bucket, true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
    ON CONFLICT (id) DO NOTHING;

    EXECUTE format($p$CREATE POLICY %I ON storage.objects
      FOR SELECT TO authenticated USING (bucket_id = %L AND %s)$p$,
      bucket || ': cada usuario ve lo suyo', bucket, own_folder);
    EXECUTE format($p$CREATE POLICY %I ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = %L AND %s)$p$,
      bucket || ': cada usuario sube lo suyo', bucket, own_folder);
    EXECUTE format($p$CREATE POLICY %I ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = %L AND %s) WITH CHECK (bucket_id = %L AND %s)$p$,
      bucket || ': cada usuario reemplaza lo suyo', bucket, own_folder, bucket, own_folder);
    EXECUTE format($p$CREATE POLICY %I ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = %L AND %s)$p$,
      bucket || ': cada usuario borra lo suyo', bucket, own_folder);
  END LOOP;
END $$;
