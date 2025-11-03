import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import insertBox from "../src/services/insertBox"
import getArea, { Area } from "../src/services/getArea";
import getBoxes from "../src/services/getBoxes";
import { Box } from "../src/types";
import getSubarea, { Subarea } from "../src/services/getSubarea";
import insertItem from "../src/services/insertItem";
import { RootStackParamList } from "../src/navigation/types";

interface AddScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function AddScreen({ navigate }: AddScreenProps) {
  const [tab, setTab] = useState<"Box" | "Item" | null>(null);
  const [boxTitle, setBoxTitle] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [boxDeadline, setBoxDeadline] = useState("");
  const [boxArea, setBoxArea] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPriority, setItemPriority] = useState("");
  const [itemBox, setItemBox] = useState<string | null>(null);
  const [itemSubitem, setItemSubitem] = useState<string | null>(null);
  const [subitemOptions, setSubitemOptions] = useState<string[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerOnSelect, setPickerOnSelect] = useState<(val: string) => void>(() => () => {});
  const [selectedId, setSelectedId] = useState<number>();
  const [areas, setAreas] = useState<Area[]>([]);
  const [box, setBox] = useState<Box[]>([]);

  const getAreas = async () => {
    try {
      const area: Area[] = await getArea();
      setAreas(area);
    } catch (error) {
      console.error("Erro ao carregar áreas:", error);
    }
  };

  const getBoxesScreen = async () => {
    try {
      const box: Box[] = await getBoxes();
      setBox(box);
    } catch (error) {
      console.error("Erro ao carregar boxes:", error);
    }
  };

  const getSubareaScreen = async (idArea: number) => {
    try {
      const subarea: Subarea[] = await getSubarea(idArea);
      return subarea;
    } catch (error) {
      console.error("Erro ao carregar subáreas:", error);
    }
  };

  useEffect(() => {
    getAreas();
    getBoxesScreen();
  }, []);

  const openAreaPicker = () => {
    const areaNames = areas.map((a) => a.area_name);
    setPickerOptions(areaNames);
    setPickerOnSelect(() => (areaName: string) => {
      const selectedArea = areas.find((area) => area.area_name === areaName);
      if (selectedArea) {
        setBoxArea(selectedArea.area_name);
        setSelectedId(selectedArea.id);
      }
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const openBoxPickerForItem = () => {
    const options = box.map((b) => b.box_title);
    setPickerOptions(options);
    setPickerOnSelect(() => async (boxTitle: string) => {
      setItemBox(boxTitle);
      setPickerVisible(false);
      const selectedBox = box.find((b) => b.box_title === boxTitle);
      if (selectedBox) {
        const subareas = (await getSubareaScreen(selectedBox.box_area)) ?? [];
        setSubitemOptions(subareas.map((sa) => sa.subarea_name));
        setItemSubitem(null);
      } else {
        setSubitemOptions([]);
        setItemSubitem(null);
      }
    });
    setPickerVisible(true);
  };

  const openSubitemPicker = () => {
    if (!subitemOptions.length) return;
    setPickerOptions(subitemOptions);
    setPickerOnSelect(() => (val: string) => {
      setItemSubitem(val);
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const formatDeadlineToTimestamptz = (input: string) => {
    if (!input) return null;
    const numberOnly = input.replace(/\D/g, "");
    if (numberOnly.length !== 8) return null;
    const day = numberOnly.substring(0, 2);
    const month = numberOnly.substring(2, 4);
    const year = numberOnly.substring(4, 8);
    return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
  };

  const formatDateInput = (value: string) => {
    const numberOnly = value.replace(/\D/g, "").substring(0, 8);
    if (numberOnly.length <= 2) return numberOnly;
    if (numberOnly.length <= 4) return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}`;
    return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}/${numberOnly.substring(4, 8)}`;
  };

  const isValidDate = (dateStr: string) => {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    if (!dayStr || !monthStr || !yearStr) return false;
    const date = new Date(+yearStr, +monthStr - 1, +dayStr);
    return date.getFullYear() === +yearStr && date.getMonth() === +monthStr - 1 && date.getDate() === +dayStr;
  };

  const handleCreateBox = async () => {
    if (!boxTitle || !boxArea || !boxDescription) {
      alert("Informe título, descrição e área!");
      return;
    }
    if (boxDeadline && !isValidDate(boxDeadline)) {
      alert("Informe uma data válida!");
      return;
    }
    const deadlineTimestamptz = boxDeadline ? formatDeadlineToTimestamptz(boxDeadline) : undefined;
    try {
      await insertBox(boxTitle, boxDescription, selectedId, deadlineTimestamptz);
      setBoxTitle("");
      setBoxDescription("");
      setBoxDeadline("");
      setBoxArea(null);
      navigate("Boxes");
    } catch (err) {
      console.error("Erro ao inserir box:", err);
      alert("Erro ao adicionar a box. Tente novamente.");
    }
  };

  const handleAddItem = async () => {
    if (!itemTitle || !itemBox) {
      alert("Defina um título e escolha um box!");
      return;
    }
    const selectedBox = box.find((b) => b.box_title === itemBox);
    if (!selectedBox) {
      alert("Box inválido!");
      return;
    }
    let selectedSubareaId = 0;
    if (itemSubitem && selectedBox.box_area) {
      const subareas = await getSubareaScreen(selectedBox.box_area);
      const selectedSub = subareas?.find((sa) => sa.subarea_name === itemSubitem);
      if (selectedSub) selectedSubareaId = selectedSub.id;
    }
    let realizationDate: string | undefined = undefined;
    if (boxDeadline && isValidDate(boxDeadline)) {
      realizationDate = formatDeadlineToTimestamptz(boxDeadline) ?? undefined;
    }
    try {
      await insertItem(
        itemTitle,
        itemDescription,
        itemPriority ? Number(itemPriority) : undefined,
        realizationDate,
        selectedBox.id,
        selectedSubareaId
      );
      setItemTitle("");
      setItemDescription("");
      setItemPriority("");
      setItemBox(null);
      setItemSubitem(null);
      setSubitemOptions([]);
      setBoxDeadline("");
      navigate("Boxes");
    } catch (err) {
      console.error("Erro inesperado ao adicionar item:", err);
      alert("Erro ao adicionar o item. Tente novamente.");
    }
  };

  const PickerModal = () => (
    <Modal visible={pickerVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FlatList
            data={pickerOptions}
            keyExtractor={(item, idx) => String(item) + idx}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => pickerOnSelect(item)}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.topHeader}>
        <Text style={styles.title}>Adicionar</Text>
        <Text style={styles.subtitle}>Organize essa cabecinha agitada.</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Escolha uma opção para começar:</Text>

          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tab, tab === "Box" ? styles.tabActive : styles.tabInactive]}
              onPress={() => setTab("Box")}
              activeOpacity={0.8}
            >
              <Text style={tab === "Box" ? styles.tabTextActive : styles.tabTextInactive}>Box</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, tab === "Item" ? styles.tabActive : styles.tabInactive]}
              onPress={() => setTab("Item")}
              activeOpacity={0.8}
            >
              <Text style={tab === "Item" ? styles.tabTextActive : styles.tabTextInactive}>Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        {tab && (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <View style={{ flex: 1 }}>
      <View style={styles.formPanel}>
        <ScrollView contentContainerStyle={{ paddingBottom: 4 }}>
          {tab === "Box" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Coloque um título na sua box"
                value={boxTitle}
                onChangeText={setBoxTitle}
                placeholderTextColor="#bfcad5"
              />
              <TextInput
                style={styles.input}
                placeholder="Escreva uma breve descrição"
                value={boxDescription}
                onChangeText={setBoxDescription}
                placeholderTextColor="#bfcad5"
              />
              <TextInput
                style={styles.input}
                placeholder="Estipule uma data de prazo (opcional)"
                value={boxDeadline}
                onChangeText={(text) => setBoxDeadline(formatDateInput(text))}
                placeholderTextColor="#bfcad5"
              />

              <TouchableOpacity style={styles.pickerBtn} onPress={openAreaPicker}>
                <Text style={styles.pickerBtnText}>
                  {boxArea ? boxArea : "Área (escolha uma opção da lista)"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#0b2545" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleCreateBox}>
                <Text style={styles.submitButtonText}>Cadastrar box</Text>
              </TouchableOpacity>
            </>
            ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Coloque um título no seu item"
                    value={itemTitle}
                    onChangeText={setItemTitle}
                    placeholderTextColor="#bfcad5"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Escreva uma breve descrição"
                    value={itemDescription}
                    onChangeText={setItemDescription}
                    placeholderTextColor="#bfcad5"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Defina uma prioridade: 1 a 4 (opcional)"
                    value={itemPriority}
                    onChangeText={(text) => {
                      const numeric = text.replace(/[^0-9]/g, '');
                      if (numeric === '' || /^[1-4]$/.test(numeric)) {
                        setItemPriority(numeric);
                      }
                    }}
                    keyboardType="numeric"
                    placeholderTextColor="#bfcad5"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Informe uma data de realização"
                    value={boxDeadline}
                    onChangeText={(text) => setBoxDeadline(formatDateInput(text))}
                    placeholderTextColor="#bfcad5"
                  />

                  <TouchableOpacity style={styles.pickerBtn} onPress={openBoxPickerForItem}>
                    <Text style={styles.pickerBtnText}>
                      {itemBox ? itemBox : "Box (escolha uma opção da lista)"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#0b2545" />
                  </TouchableOpacity>

                  {subitemOptions.length > 0 && (
                    <TouchableOpacity style={styles.pickerBtn} onPress={openSubitemPicker}>
                      <Text style={styles.pickerBtnText}>
                        {itemSubitem ? itemSubitem : "Subárea (escolha uma opção)"}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color="#0b2545" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.submitButton} onPress={handleAddItem}>
                    <Text style={styles.submitButtonText}>Adicionar item</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    )}
    </ScrollView>

      {PickerModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#eef4ed" 
  },
  topHeader: { 
    paddingVertical: 20, 
    alignItems: "center", 
    padding: 20, 
    marginTop: 30 
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
    marginBottom: 10 
  },
  section: { 
    paddingHorizontal: 20, 
    marginTop: 10 
  },
  sectionLabel: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 35 
  },
  tabsRow: { 
    flexDirection: "row", 
    justifyContent: "center"
  },
  tab: { 
    flex: 1, 
    padding: 45, 
    borderRadius: 8, 
    alignItems: "center", 
    marginHorizontal: 15,
    shadowColor: "#0b2545",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
  },
  tabActive: { 
    backgroundColor: "#0b2545"
  },
  tabInactive: { 
    backgroundColor: "#8da9c4" 
  },
  tabTextActive: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 20,
  },
  tabTextInactive: { 
    color: "#0b2545", 
    fontWeight: "bold", 
    fontSize: 20 
  },
  formPanel: { 
    flex: 1,
    backgroundColor: "#0b2545", 
    padding: 40,
    paddingHorizontal: 55,
    height: 600,
    margin: -20,

  },
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 15,
    marginBottom: 15, 
    fontSize: 15
  },
  pickerBtn: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 12, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  pickerBtnText: { 
    color: "#0b2545", 
    fontSize: 14 
  },
  submitButton: {
    backgroundColor: "#8da9c4",
    borderRadius: 80,
    paddingVertical: 12,
    marginTop: 30,
    alignItems: "center",
  },
  submitButtonText: { 
    color: "#0b2545", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
});