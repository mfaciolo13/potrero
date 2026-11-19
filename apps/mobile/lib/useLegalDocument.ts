import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "./api";
import type { LegalDocument } from "./legal/types";

export type LegalDocumentKey = "terms" | "privacy" | "accountDeletion";

export const useLegalDocument = (key: LegalDocumentKey) => {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/policies/current")
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const { documents } = (await response.json()) as { documents: Record<LegalDocumentKey, LegalDocument> };
        if (!cancelled) setDocument(documents[key]);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const retry = useCallback(() => {
    setError(false);
    setAttempt((n) => n + 1);
  }, []);

  return { document, error, retry };
};
