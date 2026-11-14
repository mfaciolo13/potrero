import type { TranslationKey } from "@/i18n";

export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCredentials = (email: string, password: string): TranslationKey | null => {
  if (!EMAIL_PATTERN.test(email.trim())) return "auth.errors.invalidEmail";
  if (password.length < MIN_PASSWORD_LENGTH) return "auth.errors.shortPassword";
  return null;
};

const ERROR_KEYS: Record<string, TranslationKey> = {
  invalid_credentials: "auth.errors.invalidCredentials",
  user_already_exists: "auth.errors.emailTaken",
  email_exists: "auth.errors.emailTaken",
  weak_password: "auth.errors.shortPassword",
  email_not_confirmed: "auth.errors.emailNotConfirmed",
  over_request_rate_limit: "auth.errors.tooManyRequests",
  over_email_send_rate_limit: "auth.errors.tooManyRequests",
};

export const authErrorKey = (error: unknown): TranslationKey => {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  return ERROR_KEYS[code] ?? "errors.signInFailed";
};
