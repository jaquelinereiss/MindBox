import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import updateBox from "../src/services/updateBox";
import { Box } from "../src/types";
import { useEffect, useState } from "react";

interface BoxEditModalProps {
  visible: boolean;
  onClose: () => void;
  box: Box;
  onSave: (updatedBox: Box) => void;
}

export default function BoxEditModal({ visible, onClose, box, onSave }: BoxEditModalProps) {
  const [title, setTitle] = useState(box.box_title);
  const [description, setDescription] = useState(box.box_description || "");
  const [deadline, setDeadline] = useState(box.deadline_date ? formatDateDisplay(box.deadline_date) : "");

  function formatDateDisplay(dateStr: string) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = "";
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }
    setDeadline(formatted);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Atenção", "O título e descrição são obrigatórios.");
      return;
    }

    let formattedDate: string | null = null;
    if (deadline) {
      const parts = deadline.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        if (isNaN(dateObj.getTime())) {
          Alert.alert("Erro", "Data inválida.");
          return;
        }
        formattedDate = dateObj.toISOString();
      } else {
        Alert.alert("Erro", "Data inválida.");
        return;
      }
    }

    const updatedData = {
      box_title: title.trim(),
      box_description: description.trim(),
      deadline_date: formattedDate ?? undefined,
    };

    try {
      const updatedBox = await updateBox(box.id, updatedData);
      if (updatedBox) {
        Alert.alert("Sucesso", "Box atualizado com sucesso!");
        onSave(updatedBox);
        onClose();
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o box.");
      }
    } catch (error) {
      console.error("Erro ao atualizar box:", error);
      Alert.alert("Erro", "Ocorreu um problema ao atualizar o box.");
    }
  };

  useEffect(() => {
    setTitle(box.box_title);
    setDescription(box.box_description || "");
    setDeadline(box.deadline_date ? formatDateDisplay(box.deadline_date) : "");
  }, [box]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Editar Box</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#134074" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite um título"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Escreva uma descrição"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Prazo</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe uma data"
            value={deadline}
            onChangeText={handleDateChange}
            keyboardType="number-pad"
            maxLength={10}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
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
    width: "90%",
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
    fontSize: 14,
    color: "#134074",
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
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
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#034078",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
