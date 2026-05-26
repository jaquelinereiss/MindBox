import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  onPressIcon?: () => void;
  secure?: boolean;
  style?: any;
  multiline?: boolean;
  maxLength?: number;
  showCounter?: boolean;
  keyboardType?: "default" | "number-pad" | "numeric";
  placeholderTextColor?: string;
};

export function Input({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  icon,
  iconPosition = "left",
  onPressIcon,
  secure = false,
  style,
  multiline = false,
  maxLength,
  showCounter = false,
  keyboardType = "default",
  placeholderTextColor = "#999",
}: Props) {
  const [isSecure, setIsSecure] = useState(secure);

  useEffect(() => {
    setIsSecure(secure);
  }, [secure]);

  return (
    <View>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}
      
      <View style={[styles.container, style]}>
        {icon && iconPosition === "left" && (
          <Ionicons
            name={icon}
            size={20}
            color="#034078"
            style={styles.iconLeft}
          />
        )}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          placeholderTextColor={placeholderTextColor}
          style={styles.input}
        />

        {icon &&
          iconPosition === "right" &&
          !secure &&
          (onPressIcon ? (
            <TouchableOpacity onPress={onPressIcon}>
              <Ionicons
                name={icon}
                size={20}
                color="#034078"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name={icon}
              size={20}
              color="#034078"
              style={styles.iconRight}
            />
          ))}

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

      {showCounter && maxLength ? (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {value.length}/{maxLength}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: "#134074",
    fontWeight: "500",
    marginBottom: 2,
  },
  required: {
    color: "#134074"
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  counterContainer: {
    alignItems: "flex-end",
    marginTop: -15,
    marginBottom: 8,
  },
  counterText: {
    fontSize: 10,
    color: "#888",
  },
});