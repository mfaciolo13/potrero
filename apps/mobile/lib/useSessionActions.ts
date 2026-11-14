import { useState } from "react";

import { t } from "@/i18n";

import { apiFetch } from "./api";
import { useAuth } from "./auth";

export const useSessionActions = () => {
  const { session } = useAuth();
  const [message, setMessage] = useState("");

  const handleCheckApi = async () => {
    try {
      const response = await apiFetch("/me");
      setMessage(t("home.apiResult", { status: response.status, body: await response.text() }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("errors.apiFailed"));
    }
  };

  return { session, message, handleCheckApi };
};
