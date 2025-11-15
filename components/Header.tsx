import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AddButton from "./AddButton";

type HeaderProps = {
  onAdd: () => void;
  displayName?: string;
};

export default function Header({ onAdd, displayName }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindBox</Text>
      <Text style={styles.subtitle}>
        {displayName ? `Olá, ${displayName}. Sinta-se em casa!` : "Olá. Sinta-se em casa!"}
      </Text>

      <AddButton onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40
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
});
