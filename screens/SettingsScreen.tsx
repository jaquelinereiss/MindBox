import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../src/hooks/user/useUserProfile";
import { useToast } from "../components/ToastContext";

type Props = {
  onLogout: () => void;
};

export default function SettingsScreen({ onLogout }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const { showToast } = useToast();
  const { profile, email, loadProfile, updateName } = useUserProfile();

  useEffect(() => {
    loadProfile();
  }, []);

  const startEditing = () => {
    setTempName(profile?.name || "");
    setIsEditingName(true);
  };

  const cancelEditing = () => {
    setIsEditingName(false);
    setTempName("");
  };

  const saveName = async () => {
  if (!tempName.trim()) {
    showToast("Por favor, digite um nome válido.");
    return;
  }

  try {
    await updateName(tempName);
    setIsEditingName(false);
    showToast("Nome de perfil atualizado com sucesso!");
  } catch (error) {
    console.error(error);
    showToast("Ops! Não foi possível atualizar o nome.");
  }
};

  const handleConfirmLogout = () => {
    setModalVisible(false);
    onLogout();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Seu MindBox, suas regras!</Text>

        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#ccc" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Perfil</Text>

          <View style={styles.infoBox}>
            <View style={styles.rowBetween}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color="#034078" />

                {isEditingName ? (
                  <TextInput
                    placeholder="Digite seu nome"
                    maxLength={20}
                    value={tempName}
                    onChangeText={setTempName}
                    style={styles.input}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.infoText}>
                    {profile?.name || "Aguarde..."}
                  </Text>
                )}
              </View>

              {isEditingName ? (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={saveName}>
                    <Ionicons name="checkmark-outline" size={22} color="#034078" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={cancelEditing} style={{ marginLeft: 10 }}>
                    <Ionicons name="close-outline" size={22} color="#555" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={startEditing}>
                  <Ionicons name="create-outline" size={20} color="#034078" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#034078" />
              <Text style={styles.infoText}>{email || "Aguarde..."}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Conta</Text>

          <View style={styles.infoBox}>
            <TouchableOpacity style={styles.infoItem}>
              <Ionicons name="lock-closed-outline" size={20} color="#034078" />
              <Text style={styles.actionText}>Alterar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoItem} onPress={() => setModalVisible(true)}>
              <Ionicons name="log-out-outline" size={22} color="#034078" />
              <Text style={styles.logoutTextInside}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Ionicons name="alert-circle-outline" size={34} color="#034078" />

              <Text style={styles.modalTitle}>Ei...vai sair agora?</Text>

              <Text style={styles.modalSubtitle}>
                Suas coisas ficam bem guardadas esperando você voltar.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirmLogout}>
                  <Text style={styles.buttonText}>Sair</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
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
    backgroundColor: "#034078",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 15,
    color: "#7190ad",
    textAlign: "center",
    paddingHorizontal: 2,
    marginBottom: 8,
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
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    position: "absolute",
    top: -50,
    alignSelf: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  sectionTitle: {
    alignSelf: "flex-start",
    marginTop: 25,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#034078",
  },
  infoBox: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginTop: 2,
    borderStartWidth: 1,
    borderColor: "#034078",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#034078",
    minWidth: 200,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#034078",
  },
  logoutTextInside: {
    marginLeft: 8,
    fontSize: 16,
    color: "#034078",
    fontWeight: "500",
  },
});
