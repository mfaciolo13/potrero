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
  errors: {
    signInFailed: "No se pudo iniciar sesión",
    apiFailed: "No se pudo llamar a la API",
    missingSession: "La respuesta de Google no trae la sesión",
  },
} as const;
