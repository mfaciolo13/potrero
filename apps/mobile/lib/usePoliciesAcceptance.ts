import { useState } from "react";

import { t } from "@/i18n";

import { apiFetch } from "./api";
import { useProfile } from "./profile";

export const usePoliciesAcceptance = () => {
  const { profile, refresh } = useProfile();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await apiFetch("/me/accept-policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: profile?.currentPoliciesVersion }),
      });
      if (!response.ok) throw new Error(String(response.status));
      await refresh();
    } catch {
      setError(t("policies.errors.saveFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return { accepted, setAccepted, submitting, error, handleSubmit };
};
