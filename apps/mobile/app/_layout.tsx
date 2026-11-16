import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";

import { t } from "@/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";
import { accessStage } from "@/lib/accessStage";
import { ProfileProvider, useProfile } from "@/lib/profile";
import { ThemeProvider, useTheme, useThemeFonts } from "@/theme";
import { LoadingScreen } from "@/ui";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = { initialRouteName: "index" };

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
  const { session, loading: authLoading } = useAuth();
  const { profile, loading, error } = useProfile();
  const stage = accessStage(session !== null, profile, error);

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

  if (authLoading || loading) return <LoadingScreen />;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, headerTitleStyle: theme.typography.title }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={stage === "login"}>
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={stage === "error"}>
          <Stack.Screen name="profile-error" />
        </Stack.Protected>
        <Stack.Protected guard={stage === "policies"}>
          <Stack.Screen name="accept-policies" />
        </Stack.Protected>
        <Stack.Protected guard={stage === "app"}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Screen name="terms-of-use" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="delete-account" />
        <Stack.Protected guard={__DEV__}>
          <Stack.Screen name="showcase" options={{ headerShown: true, title: t("navigation.designSystem") }} />
        </Stack.Protected>
      </Stack>
    </NavigationThemeProvider>
  );
};

export default RootLayout;
