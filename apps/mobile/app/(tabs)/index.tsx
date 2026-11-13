import { Link } from "expo-router";
import { View } from "react-native";

import { t } from "@/i18n";
import { useEmailAuth } from "@/lib/useEmailAuth";
import { useSessionActions } from "@/lib/useSessionActions";
import { useTheme } from "@/theme";
import { Button, Field, Screen, Text } from "@/ui";

const Index = () => {
  const theme = useTheme();
  const emailAuth = useEmailAuth();
  const { session, loading, message, handleSignIn, handleSignOut, handleCheckApi } = useSessionActions();

  return (
    <Screen contentStyle={{ justifyContent: "center", alignItems: "center", gap: theme.spacing.s4 }}>
      <Text variant="displayTitle">{t("home.title")}</Text>
      {loading ? null : session ? (
        <>
          <Text color="mute" align="center">
            {t("home.signedInAs", { email: session.user.email ?? "" })}
          </Text>
          <Button label={t("home.checkApi")} variant="lime" onPress={handleCheckApi} />
          <Button label={t("home.signOut")} variant="ghost" onPress={handleSignOut} />
        </>
      ) : (
        <>
          <View style={{ alignSelf: "stretch", gap: theme.spacing.s3 }}>
            <Field
              label={t("auth.email")}
              value={emailAuth.email}
              onChangeText={emailAuth.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
            <Field
              label={t("auth.password")}
              value={emailAuth.password}
              onChangeText={emailAuth.setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={emailAuth.mode === "signIn" ? "current-password" : "new-password"}
              error={emailAuth.error !== "" ? emailAuth.error : undefined}
              hint={emailAuth.notice !== "" ? emailAuth.notice : undefined}
            />
            <Button
              label={emailAuth.mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
              variant="primary"
              loading={emailAuth.submitting}
              fullWidth
              onPress={emailAuth.handleSubmit}
            />
            <Button
              label={emailAuth.mode === "signIn" ? t("auth.switchToSignUp") : t("auth.switchToSignIn")}
              variant="ghost"
              fullWidth
              onPress={emailAuth.handleToggleMode}
            />
          </View>
          <Text color="mute">{t("auth.or")}</Text>
          <Button label={t("home.signInWithGoogle")} variant="outline" onPress={handleSignIn} />
        </>
      )}
      {message !== "" && (
        <Text color="mute" align="center">
          {message}
        </Text>
      )}
      {__DEV__ && (
        <Link href="/showcase" asChild>
          <Button label={t("home.openShowcase")} variant="lime" />
        </Link>
      )}
    </Screen>
  );
};

export default Index;
