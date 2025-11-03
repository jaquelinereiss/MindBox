import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  type: "box" | "item";
  onEdit: () => void;
  onDelete: () => void;
}

export default function OptionsModal({
  visible,
  onClose,
  type,
  onEdit,
  onDelete,
}: OptionsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {type === "box" ? "Escolha uma opção" : "Escolha uma opção"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#4d535a" />
            </TouchableOpacity>
          </View>

          {/* Botão Editar */}
          <TouchableOpacity style={styles.optionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={22} color="#034078" />
            <Text style={styles.optionText}>
              {type === "box" ? "Editar Box" : "Editar Item"}
            </Text>
          </TouchableOpacity>

          {/* Botão Excluir */}
          <TouchableOpacity
            style={[styles.optionButton, { borderTopWidth: 1, borderTopColor: "#eee" }]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={22} color="#c1121f" />
            <Text style={[styles.optionText, { color: "#c1121f" }]}>
              {type === "box" ? "Excluir Box" : "Excluir Item"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#034078",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#034078",
    marginLeft: 12,
    fontWeight: "500",
  },
});
