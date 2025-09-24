import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BoxesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boxes</Text>
      <Text style={styles.subtitle}>Aqui ficam todos os seus itens organizados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", alignItems: "flex-start", padding: 20, marginTop: 30 },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 15, color: "gray", textAlign: "left", paddingHorizontal: 2 },
});
