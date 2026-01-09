import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import updateItem from "../src/services/items/updateItem";
import getBoxById from "../src/services/boxes/getBoxById";
import getSubarea, { Subarea } from "../src/services/areas/getSubarea";
import { Item } from "../src/types/Item";
import { useToast } from "../components/ToastContext";

interface Box {
  id: number;
  box_area: number;
}

interface ItemEditModalProps {
  visible: boolean;
  onClose: () => void;
  item: Item;
  boxes?: Box[];
  onItemUpdated: (updatedItem: Item) => void;
  boxAreaId?: number;
}

export default function ItemEditModal({
  visible,
  onClose,
  item,
  boxAreaId,
  onItemUpdated,
}: ItemEditModalProps) {
  const [title, setTitle] = useState(item.item_title);
  const [description, setDescription] = useState(item.item_description ?? "");
  const [priority, setPriority] = useState(item.priority_number ? String(item.priority_number) : "4");
  const [realizationDate, setRealizationDate] = useState("");

  const [subareaOptions, setSubareaOptions] = useState<Subarea[]>([]);
  const [selectedSubarea, setSelectedSubarea] = useState<number | undefined>(undefined);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loadingSubareas, setLoadingSubareas] = useState(true);

  const [titleError, setTitleError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [dateError, setDateError] = useState("");

  const { showToast } = useToast();

  function formatDateInput(value: string) {
    const numberOnly = value.replace(/\D/g, "").substring(0, 8);
    if (numberOnly.length <= 2) return numberOnly;
    if (numberOnly.length <= 4) return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}`;
    return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}/${numberOnly.substring(4, 8)}`;
  }

  function formatDeadlineToTimestamptz(input: string) {
    if (!input) return undefined;
    const numberOnly = input.replace(/\D/g, "");
    if (numberOnly.length !== 8) return undefined;
    const day = numberOnly.substring(0, 2);
    const month = numberOnly.substring(2, 4);
    const year = numberOnly.substring(4, 8);
    return new Date(`${year}-${month}-${day}T00:00:00`).toISOString();
  }


  function isValidDate(dateStr: string) {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    if (!dayStr || !monthStr || !yearStr) return false;
    const date = new Date(+yearStr, +monthStr - 1, +dayStr);
    return date.getFullYear() === +yearStr && date.getMonth() === +monthStr - 1 && date.getDate() === +dayStr;
  }

  useEffect(() => {
    if (!visible) return;
    if (item.box_related == null) return;

    const boxId = item.box_related;

    setTitle(item.item_title);
    setDescription(item.item_description ?? "");
    setPriority(item.priority_number ? String(item.priority_number) : "4");
    setRealizationDate(item.realization_date ? new Date(item.realization_date).toLocaleDateString("pt-BR") : "");
    setTitleError("");
    setPriorityError("");
    setDateError("");

    const fetchSubareas = async () => {
      setLoadingSubareas(true);
      try {
        const relatedBox = await getBoxById(boxId);
        if (relatedBox === null) throw new Error("Box relacionado não encontrado");

        const subs = await getSubarea(relatedBox.box_area);
        setSubareaOptions(subs);
        setSelectedSubarea(subs.find((s) => s.id === item.subarea_box)?.id ?? undefined);
      } catch (err) {
        console.error("Erro ao carregar subáreas:", err);
        setSubareaOptions([]);
        setSelectedSubarea(undefined);
      } finally {
        setLoadingSubareas(false);
      }
    };

    fetchSubareas();
  }, [visible]);

  const handleSave = async () => {
    setTitleError("");
    setPriorityError("");
    setDateError("");

    let valid = true;

    if (!title.trim()) {
      setTitleError("Não esqueça do título, ele é obrigatório.");
      valid = false;
    }

    const priorityNumber = priority ? Number(priority) : 4;
    if (priorityNumber < 1 || priorityNumber > 4) {
      setPriorityError("Informe um número entre 1 e 4.");
      valid = false;
    }

    if (!realizationDate.trim()) {
      setDateError("A data de realização é obrigatória.");
      valid = false;
    } else if (!isValidDate(realizationDate)) {
      setDateError("Hmm...essa data não parece válida.");
      valid = false;
    }

    if (!valid) return;

    const formattedDate = realizationDate ? formatDeadlineToTimestamptz(realizationDate) : undefined;

    const updated: Partial<Item> = {
      item_title: title.trim(),
      item_description: description.trim(),
      priority_number: priorityNumber,
      realization_date: formattedDate,
      subarea_box: selectedSubarea,
    };

    try {
      const response = await updateItem(item.id, updated);
      if (!response || !response[0]) throw new Error("Erro ao atualizar item");
      
      onItemUpdated(response[0]);
      showToast("Item atualizado com sucesso!");
      onClose();

    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      showToast("Ops! Não foi possível atualizar o item.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar informações do Item</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Título do item"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError("");
            }}
            maxLength={50}
            multiline
          />
          <View style={styles.row}>
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : <View />}
            <Text style={styles.counterText}>{title.length}/50</Text>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            maxLength={100}
            multiline
          />
          <View style={styles.row}>
            <View />
            <Text style={styles.counterText}>{description.length}/100</Text>
          </View>

          <Text style={styles.label}>Prioridade</Text>
          <TextInput
            style={styles.input}
            placeholder="Prioridade (1 a 4)"
            keyboardType="numeric"
            value={priority}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, "");
              setPriority(numeric);
              if (priorityError) setPriorityError("");
            }}
            maxLength={1}
          />
          {priorityError ? <Text style={styles.errorText}>{priorityError}</Text> : null}

          <Text style={styles.label}>Data de realização</Text>
          <TextInput
            style={styles.input}
            placeholder="Data prevista para realização"
            value={realizationDate}
            onChangeText={(text) => {
              setRealizationDate(formatDateInput(text));
              if (dateError) setDateError("");
            }}
            keyboardType="number-pad"
            maxLength={10}
          />
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Text style={styles.label}>Subárea</Text>
          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={() => setPickerVisible(true)}
            disabled={loadingSubareas || subareaOptions.length === 0}
          >
            <Text style={styles.pickerBtnText}>
              {loadingSubareas
                ? "Carregando subáreas..."
                : selectedSubarea
                ? subareaOptions.find((s) => s.id === selectedSubarea)?.subarea_name
                : subareaOptions.length > 0
                ? "Escolha uma subárea"
                : "Nenhuma subárea disponível"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#0b2545" />
          </TouchableOpacity>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* Modal de seleção da subárea */}
          <Modal visible={pickerVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={subareaOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedSubarea(item.id);
                        setPickerVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.subarea_name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
                  <Text style={styles.modalCloseText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  modal: {
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
  title: {
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
  saveBtn: {
    backgroundColor: "#134074",
    borderRadius: 8,
    padding: 12,
    marginRight: 10
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold"
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10
  },
  cancelText: {
    color: "#333",
    fontWeight: "500"
  },
  pickerBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerBtnText: {
    color: "#0b2545",
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%"
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  modalItemText: {
    fontSize: 16
  },
  modalClose: {
    marginTop: 15,
    alignItems: "center"
  },
  modalCloseText: {
    color: "#134074",
    fontWeight: "bold"
  },
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 10
  }
});
