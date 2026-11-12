import { Pressable, View } from "react-native";

import { makeStyles } from "@/theme";

import { Text } from "./Text";

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row", alignItems: "center", gap: t.spacing.s3 },
  box: {
    width: 24,
    height: 24,
    borderRadius: t.radius.sm,
    borderWidth: t.stroke.hair,
    borderColor: t.colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: t.colors.green, borderColor: t.colors.green },
  grow: { flex: 1 },
}));

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  const styles = useStyles();

  const handlePress = () => {
    onChange(!checked);
  };

  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={handlePress} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text color="onGreen">✓</Text>}
      </View>
      <Text style={styles.grow}>{label}</Text>
    </Pressable>
  );
};
