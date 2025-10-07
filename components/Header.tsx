import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  onAdd: () => void;
};

export default function Header({ onAdd }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindBox</Text>
      <Text style={styles.subtitle}>Olá. Sinta-se em casa!</Text>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>
          <Ionicons name="add-circle" size={20} color="#0b2545" /> Adicionar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 40, 
    alignItems: "center", 
    width: "100%" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#134074" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#0b2545", 
    marginBottom: 20 
  },
  button: {
    backgroundColor: "#8da9c4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 25,
  },
  buttonText: {
    alignItems: "center",
    color: "#0b2545",
    fontSize: 16,
    fontWeight: "bold",
  },
});
