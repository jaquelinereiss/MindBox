import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import insertItem from "../src/services/items/insertItem";
import getBoxById from "../src/services/boxes/getBoxById";
import getSubarea, { Subarea } from "../src/services/areas/getSubarea";
import { useToast } from "../components/ToastContext";
import getBoxes from "../src/services/boxes/getBoxes";
import { Box } from "../src/types/Box";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  boxId?: number;
  onItemCreated: () => void;
}

const screenHeight = Dimensions.get("window").height;
const menuHeight = 60;

export default function AddItemModal({
  visible,
  onClose,
  boxId,
  onItemCreated,
}: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [realizationDate, setRealizationDate] = useState("");
  const [boxName, setBoxName] = useState("");
  const [subareaOptions, setSubareaOptions] = useState<Subarea[]>([]);
  const [selectedSubarea, setSelectedSubarea] = useState<number | undefined>(undefined);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loadingSubareas, setLoadingSubareas] = useState(false);

  const [boxError, setBoxError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [subareaError, setSubareaError] = useState("");

  const [selectedBoxId, setSelectedBoxId] = useState<number | undefined>(boxId);
  const [boxOptions, setBoxOptions] = useState<Box[]>([]);
  const [boxPickerVisible, setBoxPickerVisible] = useState(false);

  const isBoxSelected = !!(boxId || selectedBoxId);
  const { showToast } = useToast();

  function formatDateInput(value: string) {
    const numberOnly = value.replace(/\D/g, "").substring(0, 8);
    if (numberOnly.length <= 2) return numberOnly;
    if (numberOnly.length <= 4)
      return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}`;
      return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2,4)}/${numberOnly.substring(4, 8)}`;
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
    return (
      date.getFullYear() === +yearStr &&
      date.getMonth() === +monthStr - 1 &&
      date.getDate() === +dayStr
    );
  }

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setRealizationDate("");
    setSelectedSubarea(undefined);
    setBoxName("");
    setSubareaOptions([]);
    setBoxError("");
    setTitleError("");
    setPriorityError("");
    setDateError("");
    setSubareaError("");
    setPickerVisible(false);
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  useEffect(() => {
    if (!visible) return;

    const loadData = async () => {
      if (boxId) {
        setSelectedBoxId(boxId);

        const box = await getBoxById(boxId);
        if (box) {
          setBoxName(box.box_title);
          const subs = await getSubarea(box.box_area);
          setSubareaOptions(subs);
        }
      }

      if (!boxId) {
        const boxes = await getBoxes();
        setBoxOptions(boxes);
      }
    };

    loadData();
  }, [visible, boxId]);

  const handleSave = async () => {
    setTitleError("");
    setPriorityError("");
    setDateError("");
    setSubareaError("");
    setBoxError("");

    let valid = true;

    const finalBoxId = boxId ?? selectedBoxId;

    if (!finalBoxId) {
      setBoxError("Escolha um box válido da lista.");
      valid = false;
    }

    if (!title.trim()) {
      setTitleError("Não esqueça do título, ele é obrigatório.");
      valid = false;
    }

    if (!selectedSubarea) {
      setSubareaError("Selecione uma subárea da lista.");
      valid = false;
    }

    const priorityNumber = priority ? Number(priority) : 4;
    if (priority && (priorityNumber < 1 || priorityNumber > 4)) {
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

    const formattedDate = formatDeadlineToTimestamptz(realizationDate);

    try {
      await insertItem(
        title.trim(),
        description.trim(),
        priorityNumber,
        formattedDate,
        finalBoxId!,
        selectedSubarea!,
      );

      showToast("Item criado com sucesso!");
      onItemCreated();
      handleClose();
    } catch (err) {
      console.error(err);
      showToast("Ops! Não foi possível criar o item.");
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={menuHeight - 80}
      >
        <View style={styles.overlay}>
          <View style={[styles.modal, { maxHeight: screenHeight * 0.8 }]}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start",
                paddingBottom: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>Adicionar Item</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Box</Text>
              {boxId ? (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: "#eee", color: "#333" },
                  ]}
                  value={boxName}
                  editable={false}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => setBoxPickerVisible(!boxPickerVisible)}
                  >
                    <Text style={styles.pickerBtnText}>
                      {selectedBoxId
                        ? boxOptions.find((b) => b.id === selectedBoxId)
                            ?.box_title
                        : "Escolha um box da lista"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#0b2545" />
                  </TouchableOpacity>

                  {boxPickerVisible && (
                    <View style={styles.dropdownContainer}>
                      {boxOptions.map((box) => (
                        <TouchableOpacity
                          key={box.id}
                          style={styles.dropdownItem}
                          onPress={async () => {
                            setSelectedBoxId(box.id);
                            setBoxName(box.box_title);
                            setBoxPickerVisible(false);
                            setLoadingSubareas(true);
                            try {
                              const subs = await getSubarea(box.box_area);
                              setSubareaOptions(subs);
                              setSelectedSubarea(undefined);
                            } finally {
                              setLoadingSubareas(false);
                            }
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {box.box_title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
              {boxError ? (
                <Text style={styles.errorText}>{boxError}</Text>
              ) : null}

              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Informe um nome para o item"
                value={title}
                onChangeText={setTitle}
                maxLength={50}
                multiline
              />
              {titleError ? (
                <Text style={styles.errorText}>{titleError}</Text>
              ) : null}

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Conte mais sobre esse item (opcional)"
                value={description}
                onChangeText={setDescription}
                maxLength={100}
                multiline
              />

              <Text style={styles.label}>Prioridade</Text>
              <TextInput
                style={styles.input}
                placeholder="Defina uma prioridade: 1 a 4 (opcional)"
                keyboardType="numeric"
                value={priority}
                onChangeText={(text) =>
                  setPriority(text.replace(/[^0-9]/g, ""))
                }
                maxLength={1}
              />
              {priorityError ? (
                <Text style={styles.errorText}>{priorityError}</Text>
              ) : null}

              <Text style={styles.label}>Data de realização</Text>
              <TextInput
                style={styles.input}
                placeholder="Indique a data prevista para realização"
                value={realizationDate}
                onChangeText={(text) =>
                  setRealizationDate(formatDateInput(text))
                }
                keyboardType="number-pad"
                maxLength={10}
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}

              <Text style={styles.label}>Subárea</Text>
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.pickerBtn,
                    !isBoxSelected && { backgroundColor: "#eee" },
                  ]}
                  onPress={() => setPickerVisible(!pickerVisible)}
                  disabled={loadingSubareas || subareaOptions.length === 0}
                >
                  <Text style={styles.pickerBtnText}>
                    {!isBoxSelected
                      ? "Escolha um box primeiro"
                      : loadingSubareas
                        ? "Carregando subáreas..."
                        : selectedSubarea
                          ? subareaOptions.find((s) => s.id === selectedSubarea)
                              ?.subarea_name
                          : "Escolha uma subárea da lista"}
                  </Text>
                  <Ionicons
                    name={pickerVisible ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#0b2545"
                  />
                </TouchableOpacity>

                {pickerVisible &&
                  !loadingSubareas &&
                  subareaOptions.length > 0 && (
                    <View style={styles.dropdownContainer}>
                      {subareaOptions.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedSubarea(item.id);
                            setPickerVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {item.subarea_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                {subareaError ? (
                  <Text style={styles.errorText}>{subareaError}</Text>
                ) : null}
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 5,
    elevation: 60,
    maxHeight: screenHeight * 0.8
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
    marginBottom: 5,
    fontSize: 14
  },
  pickerBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  pickerBtnText: {
    color: "#333",
    fontSize: 14
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
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 10
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 5,
    maxHeight: 600
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#0b2545"
  },
});
