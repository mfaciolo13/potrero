# Política de privacidad

> Borrador del equipo. Hay que revisarlo con un abogado antes de publicarlo y confirmar que cada dato esté vigente. Los datos entre corchetes los completa el equipo.

Esta política explica qué datos personales trata potrero, para qué y qué derechos tiene cada persona. Se rige por la Ley 25.326 de Protección de los Datos Personales de la República Argentina.

**Responsable del tratamiento:** [nombre y domicilio del responsable del proyecto]. **Contacto:** [mail].

## 1. Qué datos tratamos

| Dato | Cuándo se pide | Para qué |
| --- | --- | --- |
| Nombre, mail o cuenta de Google | Al registrarse | Identificar la cuenta y mostrar el nombre en torneos y perfiles |
| Foto de perfil | Al verificar la identidad o al editar el perfil | Mostrar al jugador en su perfil y en los planteles. **Es pública**: la ve cualquiera, incluso sin cuenta |
| Región | Al registrarse | Filtrar torneos y equipos de la zona |
| Rol, equipos y torneos en los que participa | Al usar la app | Armar planteles, fixture y tablas |
| Resultados, goles y tarjetas | Los carga el árbitro u organizador | Mostrar la tabla, las estadísticas y el historial del jugador |
| Cuotas, multas y pagos informados, método de pago y comprobantes | Al pagar una fecha | Llevar la cuenta de lo que debe cada equipo |
| Reseñas y calificaciones | Al calificar un torneo, un jugador o un árbitro | Mostrar la reputación dentro de la app |
| Datos del dispositivo para notificaciones | Al aceptar las notificaciones | Avisar fixture, pagos, postulaciones y resultados |
| Aceptación de políticas (fecha y versión) | Al registrarse | Dejar constancia de lo aceptado |
| Datos de verificación de identidad | Ver sección 2 | Comprobar que la persona es quien dice ser |

No pedimos domicilio, teléfono ni datos de tarjetas. Los pagos se hacen fuera de potrero.

## 2. Verificación de identidad: DNI y selfie

Para integrar un plantel, organizar o cobrar, la persona verifica su identidad con una foto del DNI y una selfie.

- La verificación la hace un **servicio externo** [proveedor a confirmar: hoy se propone Didit]. La app le envía las imágenes en el momento y el servicio las compara y devuelve el resultado.
- **potrero no guarda las fotos del DNI ni de la selfie** de la verificación.
- De todo el proceso solo guardamos: los **últimos 4 dígitos del DNI**, si la verificación fue aprobada, cuándo, y el identificador de la sesión del proveedor. El número completo no se guarda.
- La comparación de la selfie con el documento usa **datos biométricos**, que son sensibles. Por eso pedimos el **consentimiento expreso** de la persona, separado de la aceptación general, antes de empezar.
- La selfie que la persona elige como foto de perfil se guarda como cualquier otra foto de perfil y es pública. Se le avisa antes de usarla.
- El proveedor puede conservar las imágenes por un plazo propio. Configuramos el plazo más corto que permita [a confirmar con el proveedor].

## 3. Con quién compartimos datos

Usamos proveedores que tratan datos por nuestra cuenta, solo para hacer funcionar potrero:

| Proveedor | Para qué |
| --- | --- |
| Supabase | Base de datos, inicio de sesión y almacenamiento de fotos |
| Railway | Servidor de la API |
| Expo | Publicación de la web, actualizaciones de la app y notificaciones |
| Google | Inicio de sesión con Google |
| [Proveedor de verificación] | Verificación de identidad |

Algunos están en el exterior, así que los datos pueden transferirse fuera de Argentina. No vendemos datos ni los usamos para publicidad.

**Lo que ven otras personas.** Cualquier visitante ve torneos, tablas, fixture y perfiles de jugadores: nombre, foto, equipo y estadísticas. Los organizadores de un torneo ven los pagos y comprobantes de los equipos de ese torneo. Nadie más ve el mail ni los datos de verificación.

## 4. Cuánto tiempo guardamos los datos

- Mientras la cuenta esté activa.
- Los resultados y estadísticas de un torneo se conservan mientras sea parte del historial de los demás participantes.
- Las **deudas pendientes** de un equipo se conservan hasta saldarse, aunque el equipo haya sido dado de baja.
- Cuando se borra la cuenta, se aplica la sección 5.

## 5. Derechos y borrado de la cuenta

Cada persona tiene derecho a **acceder** a sus datos, **rectificarlos** y **pedir su supresión**. La app permite editar el perfil y **borrar la cuenta** desde la configuración. También se puede pedir por mail a [contacto].

Al borrar la cuenta:

1. Se eliminan el mail, el nombre, la foto de perfil y los datos de verificación, incluidos los últimos 4 dígitos del DNI.
2. Se quita a la persona de equipos y de los planteles de torneos todavía abiertos.
3. Sus partidos, goles y tarjetas de torneos ya jugados **se conservan sin nombre**: aparecen como jugador eliminado, para que no cambien los resultados de otros.
4. Sus reseñas se conservan sin nombre.
5. Si deja una deuda con un equipo u organizador, el registro de esa deuda se conserva sin datos personales hasta saldarse.

[El equipo confirma qué se conserva. Ver la decisión 7 de `docs/modelo-de-datos.md`.]

La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 y recibe las denuncias por incumplimiento: https://www.argentina.gob.ar/aaip

## 6. Seguridad

Las fotos y los datos se guardan en servicios con acceso restringido. Cada usuario solo puede subir o borrar sus propios archivos. La base de datos solo es accesible a través de la API. Ningún sistema es infalible: si hay un incidente que afecte datos personales, lo comunicamos a las personas afectadas.

## 7. Menores de edad

[El equipo define la edad mínima para tener cuenta y si se necesita autorización de un adulto.]

## 8. Cambios

Si esta política cambia de forma importante, la app avisa y pide aceptar la nueva versión.

Versión: [fecha de publicación].
