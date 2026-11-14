import { useState } from "react";
import { Pressable } from "react-native";

import { t } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { makeStyles } from "@/theme";
import { Button, Text } from "@/ui";

type SignOutButtonProps = { variant?: "button" | "cross" };

const useStyles = makeStyles((theme) => ({
  cross: {
    alignSelf: "flex-end",
    width: theme.spacing.touch,
    height: theme.spacing.touch,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const SignOutButton = ({ variant = "button" }: SignOutButtonProps) => {
  const styles = useStyles();
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

  if (variant === "cross") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("auth.signOut")}
        disabled={loading}
        onPress={handlePress}
        style={styles.cross}
      >
        <Text variant="title" color="mute">
          ✕
        </Text>
      </Pressable>
    );
  }

  return <Button label={t("auth.signOut")} variant="ghost" loading={loading} onPress={handlePress} />;
};
