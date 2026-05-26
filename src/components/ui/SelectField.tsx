import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label?: string;
  required?: boolean;
  value?: string;
  placeholder: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function SelectField({
  label,
  required,
  value,
  placeholder,
  onPress,
  icon = "chevron-down",
}: Props) {
  return (
    <View>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}
      
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={[styles.text, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>

        <Ionicons name={icon} size={18} color="#034078" />
      </TouchableOpacity>
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
    color: "#134074",
  },
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#999",
    fontSize: 14,
  },
  placeholder: {
    color: "999",
  },
});
