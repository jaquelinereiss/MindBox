import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import deleteBox from "../src/services/deleteBox";
import { Box } from "../src/types";

interface BoxDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  box: Box;
  onDeleted: () => void;
}

export default function BoxDeleteModal({ visible, onClose, box, onDeleted, }: BoxDeleteModalProps) {
  const handleDelete = async () => {
    try {
      const result = await deleteBox(box.id);

        if (result.success) {
            Alert.alert("Sucesso", "O box foi excluído.");
            onClose();
            onDeleted();
        } else {
            Alert.alert("Erro", "Ops! Não foi possível excluir o box.");
        }
    }
    catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ops! Ocorreu um erro inesperado.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Excluir o Box</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Tem certeza que deseja excluir o box?
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#134074",
  },
  label: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
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
