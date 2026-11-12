export const es = {
  navigation: {
    home: "Inicio",
    designSystem: "Design system",
  },
  home: {
    title: "Potrero",
    signedInAs: "Sesión iniciada como {{email}}",
    signInWithGoogle: "Continuar con Google",
    signOut: "Cerrar sesión",
    checkApi: "Probar la API",
    apiResult: "GET /me: {{status}} {{body}}",
    openShowcase: "Ver design system",
  },
  policies: {
    title: "Antes de empezar",
    intro: "Para usar potrero tenés que leer y aceptar las políticas de uso y la política de privacidad.",
    readTerms: "Leer las políticas de uso",
    readPrivacy: "Leer la política de privacidad",
    accept: "Leí y acepto las políticas de uso y la política de privacidad",
    continue: "Continuar",
    errors: {
      saveFailed: "No pudimos registrar la aceptación. Probá de nuevo.",
    },
  },
  errors: {
    signInFailed: "No se pudo iniciar sesión",
    apiFailed: "No se pudo llamar a la API",
    missingSession: "La respuesta de Google no trae la sesión",
  },
} as const;
