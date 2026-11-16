import { Pressable, View } from "react-native";

import { t } from "@/i18n";
import { useLogin } from "@/lib/useLogin";
import { makeStyles } from "@/theme";
import { Button, Card, Field, GoogleLogo, LabeledDivider, PitchHeader, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  content: { padding: 0 },
  body: { flex: 1, padding: theme.spacing.s4, gap: theme.spacing.s4 },
  form: { gap: theme.spacing.s3 },
  spacer: { flex: 1 },
  firstTime: { flexDirection: "row", alignItems: "center", gap: theme.spacing.s3 },
  firstTimeText: { flex: 1, gap: 2 },
}));

const Login = () => {
  const styles = useStyles();
  const login = useLogin();
  const signingIn = login.mode === "signIn";

  return (
    <Screen edges={["left", "right"]} contentStyle={styles.content}>
      <PitchHeader
        title={t(signingIn ? "auth.signInTitle" : "auth.signUpTitle")}
        subtitle={t(signingIn ? "auth.signInSubtitle" : "auth.signUpSubtitle")}
      />
      <View style={styles.body}>
        <Button
          label={t("auth.continueWithGoogle")}
          variant="surface"
          size="lg"
          fullWidth
          leading={<GoogleLogo />}
          onPress={login.handleGoogle}
        />
        <LabeledDivider label={t("auth.withEmail")} />
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
            secureTextEntry={!login.passwordVisible}
            autoCapitalize="none"
            autoComplete={signingIn ? "current-password" : "new-password"}
            error={login.error !== "" ? login.error : undefined}
            hint={login.notice !== "" ? login.notice : undefined}
            trailing={
              <Pressable accessibilityRole="button" onPress={login.handleTogglePasswordVisible}>
                <Text variant="label" color="green">
                  {t(login.passwordVisible ? "auth.hidePassword" : "auth.showPassword")}
                </Text>
              </Pressable>
            }
          />
        </View>
        <Button
          label={t(signingIn ? "auth.signIn" : "auth.signUp")}
          variant="primary"
          size="lg"
          loading={login.submitting}
          fullWidth
          onPress={login.handleSubmit}
        />
        <View style={styles.spacer} />
        <Card>
          <View style={styles.firstTime}>
            <View style={styles.firstTimeText}>
              <Text variant="title">{t(signingIn ? "auth.firstTime" : "auth.haveAccount")}</Text>
              <Text variant="secondary" color="mute">
                {t(signingIn ? "auth.firstTimeHint" : "auth.haveAccountHint")}
              </Text>
            </View>
            <Button
              label={t(signingIn ? "auth.signUp" : "auth.signIn")}
              variant="lime"
              onPress={login.handleToggleMode}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
};

export default Login;
