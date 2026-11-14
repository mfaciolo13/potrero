import { useState } from "react";

import { t } from "@/i18n";

import { useAuth } from "./auth";
import { authErrorKey, validateCredentials } from "./credentials";

export type EmailAuthMode = "signIn" | "signUp";

export const useEmailAuth = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<EmailAuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleToggleMode = () => {
    setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
    setError("");
    setNotice("");
  };

  const handleSubmit = async () => {
    const invalid = validateCredentials(email, password);
    if (invalid) {
      setError(t(invalid));
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (mode === "signIn") {
        await signInWithEmail(email.trim(), password);
      } else {
        const { needsConfirmation } = await signUpWithEmail(email.trim(), password);
        if (needsConfirmation) setNotice(t("auth.confirmEmail"));
      }
    } catch (caught) {
      setError(t(authErrorKey(caught)));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    error,
    notice,
    handleSubmit,
    handleToggleMode,
  };
};
