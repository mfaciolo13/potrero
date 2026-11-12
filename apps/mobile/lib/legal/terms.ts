import type { LegalDocument } from "./types";

export const termsOfUse: LegalDocument = {
  title: "Políticas de uso",
  intro:
    "Estas políticas rigen el uso de potrero, la app para organizar torneos de fútbol amateur. Al crear una cuenta, la persona declara que las leyó y las acepta. La aceptación queda registrada con su fecha y versión.",
  sections: [
    {
      heading: "1. Quiénes usan potrero",
      blocks: [
        [
          "Visitantes: ven torneos, tablas, fixture y perfiles sin cuenta.",
          "Usuarios con cuenta: juegan, forman equipos, organizan torneos o arbitran, según su rol.",
          "Admin: el equipo de potrero, que aprueba organizadores y puede dar de baja usuarios, torneos o sponsors.",
        ],
      ],
    },
    {
      heading: "2. Reglas para todas las cuentas",
      blocks: [
        [
          "Cada persona tiene una sola cuenta, con sus datos reales.",
          "Para inscribirse en un plantel, organizar o cobrar, la persona verifica su identidad con DNI y selfie. Sin identidad verificada no se puede integrar un plantel ni jugar un partido.",
          "Las cuentas no se prestan ni se venden.",
          "No se puede suplantar a otra persona, ni usar fotos o datos de terceros como propios.",
          "No se puede cargar información falsa: resultados, tarjetas, pagos o comprobantes.",
          "Se trata con respeto a jugadores, árbitros, organizadores y al resto de las personas. No se admiten insultos, amenazas ni discriminación, tampoco en reseñas o en la foto de perfil.",
          "No se puede usar potrero para otra cosa que organizar o seguir torneos amateur, ni intentar acceder a datos de otras personas.",
        ],
      ],
    },
    {
      heading: "3. Reglas de los torneos",
      blocks: [
        [
          "La inscripción de un equipo es gratuita. El organizador cobra una cuota por fecha a cada equipo.",
          "Una fecha impaga no impide jugarla, pero la cuota pasa a vencida y se suma una multa fija, definida por el torneo.",
          "Un equipo con una fecha anterior vencida solo puede perder por walkover (3-0 en contra).",
          "Dos fechas seguidas impagas dan de baja al equipo. Sus partidos ya jugados se mantienen y los pendientes se cancelan.",
          "La deuda de un equipo dado de baja sigue siendo exigible por el organizador.",
          "Saldar la deuda vuelve a habilitar al equipo, mientras no haya sido dado de baja.",
          "Los resultados los carga el árbitro y el organizador puede corregirlos. Las estadísticas salen solo de los resultados cargados.",
        ],
        "Los pagos entre equipos y organizadores se hacen fuera de potrero, en efectivo o por transferencia. potrero registra lo que se informa y lo que el organizador confirma, pero no cobra ni garantiza ningún pago.",
      ],
    },
    {
      heading: "4. Organizadores, árbitros y sponsors",
      blocks: [
        [
          "Para organizar torneos hay que pedir la aprobación del admin, con verificación de identidad. Un organizador no puede jugar en torneos.",
          "El árbitro entra con el link de invitación de un organizador.",
          "Cualquier usuario verificado puede proponer un sponsor para un torneo. El admin lo aprueba o rechaza. Solo puede haber un sponsor principal por torneo. No se aceptan sponsors de alcohol para menores, juegos de azar, contenido ilegal ni marcas que el sponsor no tenga derecho a usar.",
        ],
      ],
    },
    {
      heading: "5. Causas de baja de una cuenta, un torneo o un sponsor",
      blocks: [
        "El admin puede dar de baja una cuenta, un torneo o un sponsor cuando:",
        [
          "Se verifica que la persona usa una identidad falsa o ajena, o tiene más de una cuenta.",
          "Se carga información falsa a propósito: resultados, pagos, comprobantes o documentos.",
          "Hay acoso, amenazas, discriminación u otro maltrato, dentro de la app o en el contexto de un torneo.",
          "Se publica contenido ilegal, ofensivo o que viola derechos de terceros, incluidas fotos, escudos, logos y reseñas.",
          "Se intenta acceder a datos ajenos, alterar la app o evadir sus reglas.",
          "Un organizador cobra y no cumple lo que prometió, o deja un torneo sin resolver tras reclamos fundados.",
          "Un sponsor incumple las condiciones de la sección 4.",
        ],
        "Lo dado de baja deja de mostrarse públicamente. Quien fue dado de baja recibe el motivo. Los partidos jugados, los resultados y las deudas se conservan, porque forman parte del historial de otras personas. Una cuenta dada de baja no puede volver a crearse con la misma identidad sin que el admin lo autorice.",
        "La baja de un equipo por falta de pago (sección 3) es automática y no pasa por el admin.",
      ],
    },
    {
      heading: "6. Cambios",
      blocks: [
        "Las políticas pueden cambiar. Cuando cambien de forma importante, la app avisa y pide aceptar la nueva versión. Seguir usando potrero sin aceptarla no es posible.",
      ],
    },
    {
      heading: "7. Contacto",
      blocks: ["Para consultas o reclamos: [mail de contacto]."],
    },
  ],
};
