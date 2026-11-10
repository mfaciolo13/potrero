import { Link } from "expo-router";

import { useSessionActions } from "@/lib/useSessionActions";
import { useTheme } from "@/theme";
import { Button, Screen, Text } from "@/ui";

const Index = () => {
  const theme = useTheme();
  const { session, loading, message, handleSignIn, handleSignOut, handleCheckApi } = useSessionActions();

  return (
    <Screen contentStyle={{ justifyContent: "center", alignItems: "center", gap: theme.spacing.s4 }}>
      <Text variant="displayTitle">Potrero</Text>
      {loading ? null : session ? (
        <>
          <Text color="mute" align="center">
            Sesión iniciada como {session.user.email}
          </Text>
          <Button label="Probar la API" variant="lime" onPress={handleCheckApi} />
          <Button label="Cerrar sesión" variant="ghost" onPress={handleSignOut} />
        </>
      ) : (
        <Button label="Continuar con Google" variant="primary" onPress={handleSignIn} />
      )}
      {message !== "" && (
        <Text color="mute" align="center">
          {message}
        </Text>
      )}
      {__DEV__ && (
        <Link href="/showcase" asChild>
          <Button label="Ver design system" variant="lime" />
        </Link>
      )}
    </Screen>
  );
};

export default Index;
