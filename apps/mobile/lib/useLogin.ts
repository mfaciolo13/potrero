import { useState } from "react";

import { t } from "@/i18n";

import { useAuth } from "./auth";
import { authErrorKey, validateCredentials } from "./credentials";

export type LoginMode = "signIn" | "signUp";

export const useLogin = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<LoginMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleToggleMode = () => {
    setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
    setError("");
    setNotice("");
  };

  const handleTogglePasswordVisible = () => {
    setPasswordVisible((current) => !current);
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

  const handleGoogle = async () => {
    setError("");
    setNotice("");
    try {
      await signInWithGoogle();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("errors.signInFailed"));
    }
  };

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    passwordVisible,
    submitting,
    error,
    notice,
    handleTogglePasswordVisible,
    handleSubmit,
    handleToggleMode,
    handleGoogle,
  };
};
