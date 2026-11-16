import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { useTheme } from "@/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const CENTER = 512;
const RADIUS = 220;
const HALF_LINE = 320;
const STROKE = 24;
const DOT = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type AnimatedLogoProps = { size?: number };

export const AnimatedLogo = ({ size = 220 }: AnimatedLogoProps) => {
  const theme = useTheme();
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const [line] = useState(() => new Animated.Value(0));
  const [ring] = useState(() => new Animated.Value(0));
  const [dot] = useState(() => new Animated.Value(0));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion === null) return;
    if (reduceMotion) {
      line.setValue(1);
      ring.setValue(1);
      dot.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1.25, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(dot, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]),
    );
    const intro = Animated.sequence([
      Animated.parallel([
        Animated.timing(line, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(ring, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
      Animated.spring(dot, { toValue: 1, friction: 4, tension: 120, useNativeDriver: false }),
    ]);
    intro.start(({ finished }) => finished && pulse.start());

    return () => {
      intro.stop();
      pulse.stop();
    };
  }, [reduceMotion, line, ring, dot]);

  const lineOffset = line.interpolate({ inputRange: [0, 1], outputRange: [HALF_LINE, 0] });
  const ringOffset = ring.interpolate({ inputRange: [0, 1], outputRange: [CIRCUMFERENCE, 0] });
  const dotRadius = dot.interpolate({ inputRange: [0, 1], outputRange: [0, DOT] });
  const color = theme.colors.lime;

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <AnimatedLine
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - HALF_LINE}
        stroke={color}
        strokeWidth={STROKE}
        strokeDasharray={HALF_LINE}
        strokeDashoffset={lineOffset}
      />
      <AnimatedLine
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER + HALF_LINE}
        stroke={color}
        strokeWidth={STROKE}
        strokeDasharray={HALF_LINE}
        strokeDashoffset={lineOffset}
      />
      <AnimatedCircle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={ringOffset}
        rotation={-90}
        origin={`${CENTER}, ${CENTER}`}
      />
      <AnimatedCircle cx={CENTER} cy={CENTER} r={dotRadius} fill={color} />
    </Svg>
  );
};
