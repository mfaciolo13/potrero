import { View } from "react-native";

import { t } from "@/i18n";
import { useLogin } from "@/lib/useLogin";
import { makeStyles } from "@/theme";
import { Button, Field, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  content: { justifyContent: "center", alignItems: "center", gap: theme.spacing.s4 },
  form: { alignSelf: "stretch", gap: theme.spacing.s3 },
}));

const Login = () => {
  const styles = useStyles();
  const login = useLogin();

  return (
    <Screen edges={["top", "left", "right"]} contentStyle={styles.content}>
      <Text variant="displayTitle">{t("home.title")}</Text>
      <Text color="mute" align="center">
        {t("auth.subtitle")}
      </Text>
      <View style={styles.form}>
        <Field
          label={t("auth.email")}
          value={login.email}
          onChangeText={login.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
        />
        <Field
          label={t("auth.password")}
          value={login.password}
          onChangeText={login.setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={login.mode === "signIn" ? "current-password" : "new-password"}
          error={login.error !== "" ? login.error : undefined}
          hint={login.notice !== "" ? login.notice : undefined}
        />
        <Button
          label={login.mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
          variant="primary"
          loading={login.submitting}
          fullWidth
          onPress={login.handleSubmit}
        />
        <Button
          label={login.mode === "signIn" ? t("auth.switchToSignUp") : t("auth.switchToSignIn")}
          variant="ghost"
          fullWidth
          onPress={login.handleToggleMode}
        />
      </View>
      <Text color="mute">{t("auth.or")}</Text>
      <Button label={t("auth.continueWithGoogle")} variant="outline" onPress={login.handleGoogle} />
    </Screen>
  );
};

export default Login;
