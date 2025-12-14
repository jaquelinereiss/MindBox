import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AddButtonProps = {
  onPress: () => void;
};

export default function AddButton({ onPress }: AddButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="add-circle" size={22} color="#0b2545" />
      <Text style={styles.buttonText}>Criar novo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8da9c4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 15,
    alignSelf: "center",
  },
  buttonText: {
    color: "#0b2545",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
