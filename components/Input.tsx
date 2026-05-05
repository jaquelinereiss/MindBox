import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  secure?: boolean;
  style?: any;
};

export function Input({
  placeholder,
  value,
  onChangeText,
  icon,
  iconPosition = "left",
  secure = false,
  style
}: Props) {
  const [isSecure, setIsSecure] = useState(secure);

  useEffect(() => {
  setIsSecure(secure);
}, [secure]);

  return (
    <View style={[styles.container, style]}>
      {icon && iconPosition === "left" && (
        <Ionicons name={icon} size={20} color="#034078" style={styles.iconLeft} />
      )}

      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        style={styles.input}
      />

      {icon && iconPosition === "right" && !secure && (
        <Ionicons name={icon} size={20} color="#034078" style={styles.iconRight} />
      )}

      {secure && value.length > 0 && (
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
          <Ionicons
            name={isSecure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333"
  },
  iconLeft: {
    marginRight: 10
  },
  iconRight: {
    marginLeft: 10
  }
});