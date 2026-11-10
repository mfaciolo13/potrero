import type { LegalDocument } from "./types";

export const CONTACT_EMAIL = "[mail de contacto]";

export const privacyPolicy: LegalDocument = {
  title: "Política de privacidad",
  intro:
    "Esta política explica qué datos personales trata potrero, para qué y qué derechos tiene cada persona. Se rige por la Ley 25.326 de Protección de los Datos Personales de la República Argentina. Responsable del tratamiento: [nombre y domicilio del responsable]. Contacto: [mail de contacto].",
  sections: [
    {
      heading: "1. Qué datos tratamos",
      blocks: [
        [
          "Nombre, mail o cuenta de Google: para identificar la cuenta y mostrar el nombre en torneos y perfiles.",
          "Foto de perfil: para mostrar al jugador en su perfil y en los planteles. Es pública: la ve cualquiera, incluso sin cuenta.",
          "Región: para filtrar torneos y equipos de la zona.",
          "Rol, equipos y torneos en los que participa: para armar planteles, fixture y tablas.",
          "Resultados, goles y tarjetas: los cargan el árbitro o el organizador, para mostrar la tabla, las estadísticas y el historial.",
          "Cuotas, multas, pagos informados, método de pago y comprobantes: para llevar la cuenta de lo que debe cada equipo.",
          "Reseñas y calificaciones: para mostrar la reputación dentro de la app.",
          "Datos del dispositivo para notificaciones: para avisar fixture, pagos, postulaciones y resultados.",
          "Aceptación de políticas (fecha y versión): para dejar constancia de lo aceptado.",
          "Datos de verificación de identidad: ver la sección 2.",
        ],
        "No pedimos domicilio, teléfono ni datos de tarjetas. Los pagos se hacen fuera de potrero.",
      ],
    },
    {
      heading: "2. Verificación de identidad: DNI y selfie",
      blocks: [
        "Para integrar un plantel, organizar o cobrar, la persona verifica su identidad con una foto del DNI y una selfie.",
        [
          "La verificación la hace un servicio externo [proveedor a confirmar]. La app le envía las imágenes en el momento y el servicio las compara y devuelve el resultado.",
          "potrero no guarda las fotos del DNI ni de la selfie de la verificación.",
          "Solo guardamos los últimos 4 dígitos del DNI, si la verificación fue aprobada, cuándo, y el identificador de la sesión del proveedor. El número completo no se guarda.",
          "La comparación de la selfie con el documento usa datos biométricos, que son sensibles. Por eso pedimos el consentimiento expreso de la persona, separado de la aceptación general, antes de empezar.",
          "La selfie que la persona elige como foto de perfil se guarda como cualquier otra foto de perfil y es pública. Se le avisa antes de usarla.",
          "El proveedor puede conservar las imágenes por un plazo propio. Configuramos el plazo más corto que permita [a confirmar con el proveedor].",
        ],
      ],
    },
    {
      heading: "3. Con quién compartimos datos",
      blocks: [
        "Usamos proveedores que tratan datos por nuestra cuenta, solo para hacer funcionar potrero:",
        [
          "Supabase: base de datos, inicio de sesión y almacenamiento de fotos.",
          "Railway: servidor de la API.",
          "Expo: publicación de la web, actualizaciones de la app y notificaciones.",
          "Google: inicio de sesión con Google.",
          "[Proveedor de verificación]: verificación de identidad.",
        ],
        "Algunos están en el exterior, así que los datos pueden transferirse fuera de Argentina. No vendemos datos ni los usamos para publicidad.",
        "Cualquier visitante ve torneos, tablas, fixture y perfiles de jugadores: nombre, foto, equipo y estadísticas. Los organizadores de un torneo ven los pagos y comprobantes de los equipos de ese torneo. Nadie más ve el mail ni los datos de verificación.",
      ],
    },
    {
      heading: "4. Cuánto tiempo guardamos los datos",
      blocks: [
        [
          "Mientras la cuenta esté activa.",
          "Los resultados y estadísticas de un torneo se conservan mientras sean parte del historial de los demás participantes.",
          "Las deudas pendientes de un equipo se conservan hasta saldarse, aunque el equipo haya sido dado de baja.",
          "Cuando se borra la cuenta, se aplica la sección 5.",
        ],
      ],
    },
    {
      heading: "5. Derechos y borrado de la cuenta",
      blocks: [
        "Cada persona tiene derecho a acceder a sus datos, rectificarlos y pedir su supresión. La app permite editar el perfil y borrar la cuenta desde la configuración. También se puede pedir por mail a [mail de contacto]. Los detalles están en la página de eliminación de cuenta: /eliminar-cuenta.",
        "La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 y recibe las denuncias por incumplimiento: https://www.argentina.gob.ar/aaip",
      ],
    },
    {
      heading: "6. Seguridad",
      blocks: [
        "Las fotos y los datos se guardan en servicios con acceso restringido. Cada usuario solo puede subir o borrar sus propios archivos. La base de datos solo es accesible a través de la API. Ningún sistema es infalible: si hay un incidente que afecte datos personales, lo comunicamos a las personas afectadas.",
      ],
    },
    {
      heading: "7. Menores de edad",
      blocks: ["[El equipo define la edad mínima para tener cuenta y si se necesita autorización de un adulto.]"],
    },
    {
      heading: "8. Cambios",
      blocks: [
        "Si esta política cambia de forma importante, la app avisa y pide aceptar la nueva versión. Versión: [fecha de publicación].",
      ],
    },
  ],
};
