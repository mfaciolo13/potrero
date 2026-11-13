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
  auth: {
    email: "Mail",
    password: "Contraseña",
    signIn: "Iniciar sesión",
    signUp: "Crear cuenta",
    switchToSignUp: "¿No tenés cuenta? Creá una",
    switchToSignIn: "¿Ya tenés cuenta? Iniciá sesión",
    or: "o",
    confirmEmail: "Te enviamos un mail para confirmar la cuenta. Abrí el link y después iniciá sesión.",
    errors: {
      invalidEmail: "Ingresá un mail válido.",
      shortPassword: "La contraseña tiene que tener al menos 6 caracteres.",
      invalidCredentials: "El mail o la contraseña no son correctos.",
      emailTaken: "Ya existe una cuenta con ese mail.",
      emailNotConfirmed: "Todavía no confirmaste tu mail. Revisá tu casilla.",
      tooManyRequests: "Hiciste demasiados intentos. Esperá un rato y probá de nuevo.",
    },
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
