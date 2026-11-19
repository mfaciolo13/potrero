export const es = {
  navigation: {
    home: "Inicio",
    back: "Volver",
    designSystem: "Design system",
  },
  home: {
    title: "Potrero",
    signedInAs: "Sesión iniciada como {{email}}",
    checkApi: "Probar la API",
    apiResult: "GET /me: {{status}} {{body}}",
    openShowcase: "Ver design system",
  },
  auth: {
    signInTitle: "Entrar",
    signUpTitle: "Crear cuenta",
    signInSubtitle: "Con tu mail o con Google. Sin contraseñas nuevas.",
    signUpSubtitle: "Creá tu cuenta con tu mail o con Google.",
    continueWithGoogle: "Continuar con Google",
    signOut: "Cerrar sesión",
    withEmail: "O con tu mail",
    email: "Mail",
    password: "Contraseña",
    showPassword: "Mostrar",
    hidePassword: "Ocultar",
    signIn: "Entrar",
    signUp: "Crear cuenta",
    firstTime: "¿Primera vez?",
    firstTimeHint: "Creás la cuenta, verificás identidad y elegís tu región. Cinco minutos.",
    haveAccount: "¿Ya tenés cuenta?",
    haveAccountHint: "Entrá con tu mail o con Google.",
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
  profileError: {
    title: "No pudimos cargar tu perfil",
    message: "Revisá tu conexión e intentá de nuevo. Si el problema sigue, cerrá sesión y volvé a entrar.",
    retry: "Reintentar",
  },
  role: {
    title: "¿Qué vas a hacer?",
    subtitle: "Un organizador no juega en los torneos.",
    label: "Quiero usar la app como",
    player: {
      title: "Jugador",
      badge: "Inmediato",
      description:
        "Te postulás a equipos, tenés perfil con estadísticas, podés crear tu equipo y ser capitán. Listo para terminar.",
    },
    organizer: {
      title: "Organizador",
      badge: "Requiere aprobación",
      description:
        "Creás torneos en tu región, invitás árbitros, confirmás pagos y el equipo de Potrero lo aprueba.",
    },
    continue: "Continuar",
    errors: {
      saveFailed: "No pudimos guardar tu elección. Probá de nuevo.",
      regionRequired: "Primero tenés que declarar tu región.",
    },
  },
  legal: {
    error: {
      title: "No pudimos cargar el texto",
      message: "Revisá tu conexión e intentá de nuevo.",
      retry: "Reintentar",
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
