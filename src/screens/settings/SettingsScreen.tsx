import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfile } from "../../hooks/user/useUserProfile";
import { useToast } from "../../components/feedback/ToastContext";
import { supabase } from "../../lib/supabaseClient";
import { CenterSheet } from "../../components/ui/CenterSheet";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type Props = {
  onLogout: () => void;
};

export default function SettingsScreen({ onLogout }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { showToast } = useToast();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [tempName, setTempName] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const { profile, email, loadProfile, updateName } = useUserProfile();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const startEditing = () => {
    setTempName(profile?.name || "");
    setNameModalVisible(true);
  };

  const saveName = async () => {
    if (!tempName.trim()) {
      showToast("Por favor, digite um nome válido.");
      return;
    }

    try {
      setLoadingName(true);

      await updateName(tempName);

      showToast("Nome de perfil atualizado com sucesso!");

      setNameModalVisible(false);
      setTempName("");
    } catch (error) {
      console.error(error);
      showToast("Ops! Não foi possível atualizar o nome.");
    } finally {
      setLoadingName(false);
    }
  };

  const handleConfirmLogout = () => {
    setModalVisible(false);
    onLogout();
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 8) {
      showToast("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoadingPassword(true);

      const { error: logoutError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (logoutError) {
        showToast("Senha atual incorreta.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        showToast("Erro ao atualizar a senha.");
        return;
      }

      showToast("Senha atualizada com sucesso!");
      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      showToast("Ops! Não foi possível alterar a senha.");
    } finally {
      setLoadingPassword(false);
    }
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
                <Text style={styles.infoText}>
                  {profile?.name || "Aguarde..."}
                </Text>
              </View>
              <TouchableOpacity onPress={startEditing}>
                <Ionicons name="create-outline" size={20} color="#034078" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#034078" />
              <Text style={styles.infoText}>{email || "Aguarde..."}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Conta</Text>

          <View style={styles.infoBox}>
            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => {
                setPasswordModalVisible(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#034078" />
              <Text style={styles.actionText}>Alterar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="log-out-outline" size={22} color="#034078" />
              <Text style={styles.logoutTextInside}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomSheet
          visible={nameModalVisible}
          onClose={() => setNameModalVisible(false)}
        >
          <Ionicons
            name="person-circle-outline"
            size={40}
            color="#034078"
            style={{ textAlign: "center" }}
          />
          <Text style={styles.modalTitle}>Novo nome de usuário</Text>
          <Text style={styles.modalSubtitle}>
            Seu perfil, do seu jeito. Escolha como deseja ser chamado.
          </Text>

          <View style={styles.modalForm}>
            <Input
              placeholder="Digite seu nome aqui"
              value={tempName}
              onChangeText={setTempName}
              icon="person-outline"
            />
          </View>

          <View style={styles.modalButtons}>
            <Button
              title="Salvar"
              variant="secondary"
              onPress={saveName}
              disabled={loadingName}
            />

            <Button
              title="Cancelar"
              variant="tertiary"
              onPress={() => {
                setNameModalVisible(false);
                setTempName("");
              }}
            />
          </View>
        </BottomSheet>

        <BottomSheet
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        >
          <Ionicons
            name="lock-closed-outline"
            size={34}
            color="#034078"
            style={{ textAlign: "center" }}
          />

          <Text style={styles.modalTitle}>Alterar senha</Text>

          <Text style={styles.modalSubtitle}>
            Crie uma nova senha forte e fácil de lembrar. Você usará essa senha no próximo acesso.
          </Text>

          <View style={styles.modalForm}>
            <Input
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              icon="key-outline"
              secure
            />

            <Input
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              icon="lock-open-outline"
              secure
            />
            <Input
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="checkmark-circle-outline"
              secure
            />
          </View>

          <View style={styles.modalButtons}>
            <Button
              title="Salvar"
              variant="secondary"
              onPress={handleChangePassword}
              disabled={loadingPassword}
            />

            <Button
              title="Cancelar"
              variant="tertiary"
              onPress={() => setPasswordModalVisible(false)}
            />
          </View>
        </BottomSheet>

        <CenterSheet
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <Ionicons name="alert-circle-outline" size={34} color="#034078" />

          <Text style={styles.modalTitle}>Ei...vai sair agora?</Text>
          <Text style={styles.modalSubtitle}>
            Suas coisas ficam bem guardadas esperando você voltar.
          </Text>

          <View style={styles.modalButtons}>
            <Button
              title="Sair"
              variant="secondary"
              onPress={handleConfirmLogout}
            />
            <Button
              title="Cancelar"
              variant="tertiary"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </CenterSheet>
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#034078",
    margin: 5,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  modalForm: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
