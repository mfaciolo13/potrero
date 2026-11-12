import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";

import { t } from "@/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";
import { needsPolicyAcceptance } from "@/lib/policies";
import { ProfileProvider, useProfile } from "@/lib/profile";
import { ThemeProvider, useTheme, useThemeFonts } from "@/theme";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontsError] = useThemeFonts();

  useEffect(() => {
    if (fontsLoaded || fontsError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <Navigation />
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const Navigation = () => {
  const theme = useTheme();
  const { session } = useAuth();
  const { profile, loading } = useProfile();
  const needsPolicies = session !== null && needsPolicyAcceptance(profile);

  const navigationTheme = useMemo(() => {
    const base = theme.scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.green,
        background: theme.colors.bg,
        card: theme.colors.bg,
        text: theme.colors.ink,
        border: theme.colors.line,
        notification: theme.colors.cardRed,
      },
    };
  }, [theme]);

  if (loading) return null;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, headerTitleStyle: theme.typography.title }}>
        <Stack.Protected guard={needsPolicies}>
          <Stack.Screen name="aceptar-politicas" />
        </Stack.Protected>
        <Stack.Protected guard={!needsPolicies}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Screen name="politicas-de-uso" />
        <Stack.Screen name="privacidad" />
        <Stack.Screen name="eliminar-cuenta" />
        <Stack.Protected guard={__DEV__}>
          <Stack.Screen name="showcase" options={{ headerShown: true, title: t("navigation.designSystem") }} />
        </Stack.Protected>
      </Stack>
    </NavigationThemeProvider>
  );
};

export default RootLayout;
