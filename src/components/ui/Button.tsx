import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "tertiary" && styles.tertiary,
        variant === "quaternary" && styles.quaternary,
        pressed && !disabled && !loading && { opacity: 0.7 },
        (disabled || loading) && { opacity: 0.5 },
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.textPrimary,
          variant === "secondary" && styles.textSecondary,
          variant === "tertiary" && styles.textTertiary,
          variant === "quaternary" && styles.textQuaternary,
        ]}
      >
        {loading ? "Carregando..." : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5
  },
  primary: {
    backgroundColor: "#034078"
  },
  secondary: {
    backgroundColor: "#f0f4f8"
  },
  tertiary: {
    backgroundColor: "transparent"
  },
  quaternary: {
    borderWidth: 1,
    borderColor: "#034078",
  },
  text: {
    fontWeight: "600",
    fontSize: 16
  },
  textPrimary: {
    color: "#fff"
  },
  textSecondary: {
    color: "#034078"
  },
  textTertiary: {
    color: "#034078"
  },
  textQuaternary: {
    color: "#034078"
  }
});
