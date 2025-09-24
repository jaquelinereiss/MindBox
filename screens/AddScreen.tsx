import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenName } from "../App";

interface AddScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export default function AddScreen({ onNavigate }: AddScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar</Text>
      <Text style={styles.subtitle}>Organize essa cabecinha agitada.</Text>
      <Text style={styles.paragraph}>Escolha uma opção para começar:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", alignItems: "flex-start", padding: 20, marginTop: 30 },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 15, color: "gray", textAlign: "left", paddingHorizontal: 2 },
  paragraph: { fontSize: 18, color: "gray", textAlign: "center", paddingHorizontal: 2, fontWeight: "bold", marginTop: 15 },
});
