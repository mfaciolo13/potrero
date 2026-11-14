import { useState } from "react";

import { t } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/ui";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return <Button label={t("auth.signOut")} variant="ghost" loading={loading} onPress={handlePress} />;
};
