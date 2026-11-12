import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";

import { t } from "@/i18n";
import { AuthProvider } from "@/lib/auth";
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
        <Navigation />
      </AuthProvider>
    </ThemeProvider>
  );
};

const Navigation = () => {
  const theme = useTheme();

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

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, headerTitleStyle: theme.typography.title }}>
        <Stack.Screen name="(tabs)" />
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
