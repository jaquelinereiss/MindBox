import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import deleteBox from "../src/services/boxes/deleteBox";
import { Box } from "../src/types";
import { useToast } from "./ToastContext";

interface BoxDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  box: Box;
  onDeleted: () => void;
}

export default function BoxDeleteModal({ visible, onClose, box, onDeleted, }: BoxDeleteModalProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    try {
      const result = await deleteBox(box.id);

        if (result.success) {
            showToast("Box excluído com sucesso!");
            setTimeout(() => {
              onClose();
              onDeleted();
            }, 500);
        } else {
            showToast("Ops! Não foi possível excluir o box.");
        }
    }
    catch (error) {
      console.error(error);
      showToast("Ops! Ocorreu um erro inesperado."); 
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Tem certeza que deseja excluir este box?
          </Text>
          <Text style={styles.labelAttention}>
            Atenção: todos os itens cadastrados no box serão excluídos com essa ação.
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
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
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  label: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
    marginBottom: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  labelAttention: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#c1121f",
    marginRight: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
