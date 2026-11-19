import { useState } from "react";

import { t } from "@/i18n";

import { apiFetch } from "./api";
import { useProfile } from "./profile";

export type ChosenRole = "PLAYER" | "ORGANIZER";

export const useRoleSelection = () => {
  const { refresh } = useProfile();
  const [role, setRole] = useState<ChosenRole>("PLAYER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await apiFetch("/me/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error === "region_required" ? t("role.errors.regionRequired") : t("role.errors.saveFailed"));
        return;
      }
      await refresh();
    } catch {
      setError(t("role.errors.saveFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return { role, setRole, submitting, error, handleSubmit };
};
