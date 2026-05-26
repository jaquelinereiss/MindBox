import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  children: React.ReactNode;

  activeSide?: "left" | "right";

  leftLabel?: string;
  rightLabel?: string;

  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function BottomSheetCurved({
  children,
  activeSide = "left",
  leftLabel,
  rightLabel,
  onLeftPress,
  onRightPress,
}: Props) {
  const progress = useRef(
    new Animated.Value(activeSide === "left" ? 0 : 1),
  ).current;

  const leftTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 20],
  });

  const leftTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -18],
  });

  const rightTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 8],
  });

  const rightTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -20],
  });

  const [wave, setWave] = useState(generateWave(0));

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setWave(generateWave(value));
    });

    Animated.timing(progress, {
      toValue: activeSide === "left" ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    return () => {
      progress.removeListener(listener);
    };
  }, [activeSide]);

  function interpolate(start: number, end: number, value: number) {
    return start + (end - start) * value;
  }

  function generateWave(value: number) {
    const startY = interpolate(82, 68, value);
    const endY = interpolate(68, 82, value);

    const leftPeakY = interpolate(28, 125, value);
    const leftMidY = interpolate(0, 100, value);

    const centerY = 48;

    const rightMidY = interpolate(100, 0, value);
    const rightPeakY = interpolate(125, 28, value);

    return `
      M0,${startY}

      C${SCREEN_WIDTH * 0.14},${leftPeakY}
       ${SCREEN_WIDTH * 0.3},${leftMidY}
       ${SCREEN_WIDTH * 0.52},${centerY}

      C${SCREEN_WIDTH * 0.74},${rightMidY}
       ${SCREEN_WIDTH * 0.9},${rightPeakY}
       ${SCREEN_WIDTH},${endY}

      L${SCREEN_WIDTH},105
      L0,105
      Z
    `;
  }

  return (
    <View style={styles.wrapper}>
      <Svg
        width={SCREEN_WIDTH}
        height={190}
        viewBox={`0 0 ${SCREEN_WIDTH} 190`}
        style={styles.wave}
      >
        <Path d={wave} fill="#fff" />
      </Svg>

      {leftLabel && rightLabel && (
        <View style={styles.waveContent}>
          <Animated.View
            style={{
              width: "50%",
              transform: [
                { translateY: leftTranslateY },
                { translateX: leftTranslateX },
              ],
            }}
          >
            <TouchableOpacity onPress={onLeftPress} style={styles.tabButton}>
              <Text
                style={
                  activeSide === "left"
                    ? styles.activeText
                    : styles.inactiveText
                }
              >
                {leftLabel}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              width: "50%",
              transform: [
                { translateY: rightTranslateY },
                { translateX: rightTranslateX },
              ],
            }}
          >
            <TouchableOpacity onPress={onRightPress} style={styles.tabButton}>
              <Text
                style={
                  activeSide === "right"
                    ? styles.activeText
                    : styles.inactiveText
                }
              >
                {rightLabel}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  wave: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  waveContent: {
    position: "absolute",
    top: 30,
    width: "100%",
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeText: {
    fontSize: 25,
    fontWeight: "700",
    color: "#134074",
  },
  inactiveText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#9db2ce",
  },
});
