import { useState } from "react";

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
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setMessage("");
  };

  const handleCheckApi = async () => {
    try {
      const response = await apiFetch("/me");
      setMessage(`GET /me: ${response.status} ${await response.text()}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo llamar a la API");
    }
  };

  return { session, loading, message, handleSignIn, handleSignOut, handleCheckApi };
};
