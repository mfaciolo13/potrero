import { useState } from "react";

import { t } from "@/i18n";

import { apiFetch } from "./api";
import { useAuth } from "./auth";

export const useSessionActions = () => {
  const { session, loading, signInWithGoogle, signOut } = useAuth();
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    setMessage("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("errors.signInFailed"));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setMessage("");
  };

  const handleCheckApi = async () => {
    try {
      const response = await apiFetch("/me");
      setMessage(t("home.apiResult", { status: response.status, body: await response.text() }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("errors.apiFailed"));
    }
  };

  return { session, loading, message, handleSignIn, handleSignOut, handleCheckApi };
};
