import { useState } from "react";

import { useProfile } from "./profile";

export const useProfileRetry = () => {
  const { refresh } = useProfile();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refresh();
    } finally {
      setRetrying(false);
    }
  };

  return { retrying, handleRetry };
};
