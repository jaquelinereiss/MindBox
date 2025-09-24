import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ search, setSearch, onAdd }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindBox</Text>
      <Text style={styles.subtitle}>Olá. Sinta-se em casa!</Text>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>
          <Ionicons name="add-circle" size={20} color="#0b2545" /> Adicionar
        </Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search-sharp" size={20} color="#134074" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 40, alignItems: "center", width: "100%" },
  title: { fontSize: 32, fontWeight: "bold", color: "#134074" },
  subtitle: { fontSize: 16, color: "#0b2545", marginBottom: 20 },
  button: { backgroundColor: "#8da9c4", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12, marginBottom: 25 },
  buttonText: { alignItems: "center", color: "#0b2545", fontSize: 16, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 15, height: 45, width: "90%", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3 },
  input: { flex: 1, fontSize: 16 },
});
