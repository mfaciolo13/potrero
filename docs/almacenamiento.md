# Almacenamiento de archivos

Los archivos viven en Supabase Storage. Hay dos buckets, creados por la migración [storage_buckets](../apps/api/prisma/migrations/20261107120000_storage_buckets/migration.sql).

| Bucket | Para qué | Columna que guarda la ruta | Límite |
| --- | --- | --- | --- |
| `avatars` | Foto de perfil del usuario | `users.avatar_path` | 5 MB |
| `places` | Fotos de las canchas, para la solicitud de organizador | `organizer_requests.photos` | 5 MB |

Los dos son públicos para lectura: la foto de perfil y las fotos de las canchas las ve cualquiera con la URL, incluso sin cuenta (RN-20). En los dos solo se aceptan imágenes `image/jpeg`, `image/png` y `image/webp`.

## El DNI y la selfie no se guardan

La verificación de identidad la hace un servicio externo que se consulta en el momento, y potrero no conserva el DNI ni la selfie. Por eso no hay un bucket para ellos. La selfie que se toma al verificar es la misma imagen que el usuario elige como avatar, y se guarda como cualquier otro avatar en `avatars`. El DNI nunca se sube a Storage. Ver [verificación de identidad](verificacion-identidad-dni-selfie.md).

## Permisos

Cada archivo va dentro de una carpeta con el id del usuario: `<users.id>/<nombre>`. Las políticas de `storage.objects` comparan esa primera carpeta con `auth.uid()`, así que cada usuario solo toca lo suyo.

| Acción | Quién puede |
| --- | --- |
| Ver por URL pública | Cualquiera |
| Listar, subir, reemplazar y borrar | Solo el usuario dueño de la carpeta, con sesión iniciada |

Nadie sin sesión puede subir ni borrar nada. Un usuario no puede escribir en la carpeta de otro, ni en la raíz del bucket. Borrar es un permiso del usuario sobre sus propios archivos, porque la Ley 25.326 le da derecho a retirar sus datos (ver RF-43).

## Flujo de subida

La app sube el archivo directo a Storage con la sesión del usuario, sin pasar por la API. La API solo guarda la ruta.

1. La app inicia sesión con Supabase y obtiene el `users.id`.
2. Sube el archivo con `supabase.storage.from("avatars").upload("<users.id>/avatar.jpg", archivo, { upsert: true })`. Si la carpeta no es la del usuario, Storage responde 403.
3. La app manda a la API la ruta devuelta (`<users.id>/avatar.jpg`), no la URL.
4. La API comprueba que la ruta empiece con el id del usuario autenticado y la guarda en `users.avatar_path` (o en `organizer_requests.photos` para las canchas).
5. Para mostrar una imagen, la app arma la URL pública a partir de la ruta con `supabase.storage.from("avatars").getPublicUrl(ruta)`.

La base guarda rutas y nunca URLs completas, así que cambiar de proyecto o de dominio de Supabase no rompe los datos.

El avatar siempre se sube con el mismo nombre y `upsert`, así un usuario tiene una sola foto de perfil. Para evitar que se muestre la versión vieja desde la caché, la app agrega un parámetro de versión a la URL (por ejemplo `?v=<users.updated_at>`).

## Cómo se aplica

Storage solo existe en Supabase. La migración revisa que exista el esquema `storage` y, si no está (base de sombra de Prisma o pruebas locales), no hace nada. En Supabase se aplica con `npm run db:deploy` desde `main`, como las demás.

## Puntos abiertos

1. **Otros archivos.** Escudos de equipo (`teams.crest_path`), comprobantes de pago (`payments.receipt_path`) y logos de sponsors (`sponsors.logo_path`) también tienen una columna de ruta, pero no tienen bucket todavía. Los comprobantes necesitan acceso restringido: los ve el organizador del torneo, no cualquiera. Se definen cuando se implemente cada función.
2. **Avatar público.** Como el avatar es la selfie de verificación, queda visible para cualquiera. Habría que avisárselo al usuario antes de verificar, junto con el consentimiento que pide la Ley 25.326.
