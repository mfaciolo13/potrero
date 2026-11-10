import { CONTACT_EMAIL } from "./privacy";
import type { LegalDocument } from "./types";

export const accountDeletion: LegalDocument = {
  title: "Eliminar la cuenta",
  intro:
    "Cada persona puede pedir que se borre su cuenta de potrero y los datos personales asociados. Esta página explica cómo hacerlo y qué pasa con los datos.",
  sections: [
    {
      heading: "Cómo pedir el borrado",
      blocks: [
        [
          "Desde la app: Configuración, Eliminar cuenta.",
          `Sin la app: escribí a ${CONTACT_EMAIL} desde el mail de tu cuenta, con el asunto "Eliminar cuenta". Verificamos que sea tu cuenta y la borramos.`,
        ],
      ],
    },
    {
      heading: "Qué se elimina",
      blocks: [
        [
          "El mail, el nombre y la foto de perfil.",
          "Los datos de verificación de identidad, incluidos los últimos 4 dígitos del DNI.",
          "Tu lugar en equipos y en los planteles de torneos todavía abiertos.",
          "Los datos del dispositivo para notificaciones.",
        ],
      ],
    },
    {
      heading: "Qué se conserva",
      blocks: [
        [
          "Tus partidos, goles y tarjetas de torneos ya jugados, sin tu nombre: aparecen como jugador eliminado, para que no cambien los resultados de otras personas.",
          "Tus reseñas, sin tu nombre.",
          "Si dejaste una deuda con un equipo u organizador, el registro de esa deuda sin datos personales, hasta que se salde.",
        ],
      ],
    },
    {
      heading: "Más información",
      blocks: ["Mirá la política de privacidad en /privacidad para saber cómo tratamos los datos."],
    },
  ],
};
