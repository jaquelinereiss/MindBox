import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";

type Props = {
  onLogout: () => void;
};

export default function SettingsScreen({ onLogout }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirmLogout = () => {
    setModalVisible(false);
    onLogout();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.subtitle}>Seu MindBox, suas regras!</Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="log-out-outline" size={28} color="#034078" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color="#034078"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.modalTitle}>Ei...vai sair agora?</Text>
            <Text style={styles.modalSubtitle}>
              Suas coisas ficam bem guardadas aqui, esperando você voltar.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.buttonText}>Sair</Text>
              </Pressable>

              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: "#034078" }]}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
      
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: "#eef4ed" 
  },
  container: { 
    flex: 1,
    padding: 20, 
    marginTop: 30,
  },
  title: { 
    fontSize: 25, 
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 15, 
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 2,
    marginBottom: 8
  },
  logoutButton: {
    position: "absolute",
    bottom: 120,
    left: 25,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
  },
  logoutText: {
    fontSize: 18,
    color: "#034078",
    marginLeft: 8,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#034078",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#f0f4f8",
  },
  buttonText: {
    color: "#034078",
    fontWeight: "600",
    fontSize: 16,
  },
});
