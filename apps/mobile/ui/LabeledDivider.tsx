import { View } from "react-native";

import { makeStyles } from "@/theme";

import { Text } from "./Text";

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row", alignItems: "center", gap: t.spacing.s3 },
  line: { flex: 1, height: t.stroke.hair, backgroundColor: t.colors.line },
}));

export type LabeledDividerProps = { label: string };

export const LabeledDivider = ({ label }: LabeledDividerProps) => {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text variant="label" color="mute" uppercase>
        {label}
      </Text>
      <View style={styles.line} />
    </View>
  );
};
