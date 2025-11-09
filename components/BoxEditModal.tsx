import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import updateBox from "../src/services/updateBox";
import { Box } from "../src/types";
import { useToast } from "../components/ToastContext";

interface BoxEditModalProps {
  visible: boolean;
  onClose: () => void;
  box: Box;
  onSave: (updatedBox: Box) => void;
}

export default function BoxEditModal({ visible, onClose, box, onSave }: BoxEditModalProps) {
  const [title, setTitle] = useState(box.box_title);
  const [description, setDescription] = useState(box.box_description || "");
  const [deadline, setDeadline] = useState<string | undefined>(
    box.deadline_date ? formatDateDisplay(box.deadline_date) : ""
  );

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  const { showToast } = useToast();

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
    if (cleaned.length <= 2) formatted = cleaned;
    else if (cleaned.length <= 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    else formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;

    setDeadline(formatted);
    if (deadlineError) setDeadlineError("");
  };

  const handleSave = async () => {
    setTitleError("");
    setDescriptionError("");
    setDeadlineError("");

    let valid = true;

    if (!title.trim()) {
      setTitleError("O título é obrigatório, anjo.");
      valid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Não esqueça da descrição, ela é importante.");
      valid = false;
    }

    let formattedDate: string | null = null;
    if (deadline) {
      const parts = deadline.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        if (isNaN(dateObj.getTime())) {
          setDeadlineError("A data informada parece inválida.");
          valid = false;
        } else {
          formattedDate = dateObj.toISOString();
        }
      } else {
        setDeadlineError("Hmm...essa data não parece válida.");
        valid = false;
      }
    }

    if (!valid) return;

    try {
      const updatedBox = await updateBox(box.id, {
        box_title: title.trim(),
        box_description: description.trim(),
        deadline_date: formattedDate,
      });

      if (updatedBox) {
        onSave(updatedBox);
        onClose();
        showToast("Box atualizado com sucesso!");
      } else {
        showToast("Vish! Não foi possível atualizar o box.");
      }
    } catch (err) {
      console.error(err);
      showToast("Ops! Ocorreu um problema ao atualizar o box.");
    }
  };

  useEffect(() => {
    if (visible) {
      setTitle(box.box_title);
      setDescription(box.box_description || "");
      setDeadline(box.deadline_date ? formatDateDisplay(box.deadline_date) : "");
      setTitleError("");
      setDescriptionError("");
      setDeadlineError("");
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Editar informações do Box</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite um título"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
            multiline
          />
          <View style={styles.row}>
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : <View />}
            <Text style={styles.counterText}>{title.length}/60</Text>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Escreva uma descrição"
            value={description}
            onChangeText={setDescription}
            maxLength={120}
            multiline
          />
          <View style={styles.row}>
            {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : <View />}
            <Text style={styles.counterText}>{description.length}/120</Text>
          </View>

          <Text style={styles.label}>Prazo</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe uma data"
            value={deadline}
            onChangeText={handleDateChange}
            keyboardType="number-pad"
            maxLength={10}
          />
          <View style={styles.row}>
            {deadlineError ? <Text style={styles.errorText}>{deadlineError}</Text> : <View />}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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
    alignItems: "center"
  },
  modalContainer: { 
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 6
  },
  header: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#134074"
  },
  label: {
    fontSize: 14,
    color: "#134074",
    fontWeight: "500",
    marginBottom: 5
  },
  input: { 
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  counterText: {
    fontSize: 12,
    color: "#666"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500"
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#034078"
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 10
  },
});
