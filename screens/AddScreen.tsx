import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { RootStackParamList } from "../src/navigation/types";
import { Box } from "../src/types";
import getArea, { Area } from "../src/services/areas/getArea";
import getSubarea, { Subarea } from "../src/services/areas/getSubarea";
import getBoxes from "../src/services/boxes/getBoxes";
import insertBox from "../src/services/boxes/insertBox";
import insertItem from "../src/services/items/insertItem";
import BoxForm from "../components/BoxForm";
import ItemForm from "../components/ItemForm";
import { useToast } from "../components/ToastContext";

interface AddScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function AddScreen({ navigate }: AddScreenProps) {
  const [tab, setTab] = useState<"Box" | "Item" | null>(null);

  const [boxTitle, setBoxTitle] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [boxDeadline, setBoxDeadline] = useState("");
  const [boxArea, setBoxArea] = useState<string | null>(null);
  const [errorBox, setErrorBox] = useState<string>("");

  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPriority, setItemPriority] = useState("");
  const [itemBox, setItemBox] = useState<string | null>(null);
  const [itemSubarea, setItemSubarea] = useState<string | null>(null);
  const [subareaOptions, setSubareaOptions] = useState<string[]>([]);
  const [errorItem, setErrorItem] = useState<string>("");

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerOnSelect, setPickerOnSelect] = useState<(val: string) => void>(() => () => {});

  const [selectedId, setSelectedId] = useState<number>();
  const [areas, setAreas] = useState<Area[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setAreas(await getArea());
        setBoxes(await getBoxes());
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, []);

  const openAreaPicker = () => {
    const areaNames = areas.map(a => a.area_name);
    setPickerOptions(areaNames);
    setPickerOnSelect(() => (name: string) => {
      const selected = areas.find(a => a.area_name === name);
      if (selected) {
        setBoxArea(selected.area_name);
        setSelectedId(selected.id);
      }
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const openBoxPickerForItem = () => {
    const options = boxes.map(b => b.box_title);
    setPickerOptions(options);
    setPickerOnSelect(() => async (boxTitle: string) => {
      setItemBox(boxTitle);
      setPickerVisible(false);
      const selected = boxes.find(b => b.box_title === boxTitle);
      if (selected) {
        const subareas: Subarea[] = (await getSubarea(selected.box_area)) ?? [];
        setSubareaOptions(subareas.map(sa => sa.subarea_name));
        setItemSubarea(null);
      } else {
        setSubareaOptions([]);
        setItemSubarea(null);
      }
    });
    setPickerVisible(true);
  };

  const openSubareaPicker = () => {
    if (!subareaOptions.length) return;
    setPickerOptions(subareaOptions);
    setPickerOnSelect(() => (val: string) => {
      setItemSubarea(val);
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const formatDateInput = (value: string) => {
    const numberOnly = value.replace(/\D/g, "").substring(0, 8);
    if (numberOnly.length <= 2) return numberOnly;
    if (numberOnly.length <= 4) return `${numberOnly.substring(0,2)}/${numberOnly.substring(2,4)}`;
    return `${numberOnly.substring(0,2)}/${numberOnly.substring(2,4)}/${numberOnly.substring(4,8)}`;
  };

  const formatDeadlineToTimestamptz = (input: string) => {
    if (!input) return null;
    const [day, month, year] = input.split("/");
    return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
  };

  const isValidDate = (dateStr: string) => {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    if (!dayStr || !monthStr || !yearStr) return false;
    const date = new Date(+yearStr, +monthStr - 1, +dayStr);
    return date.getFullYear() === +yearStr && date.getMonth() === +monthStr - 1 && date.getDate() === +dayStr;
  };

  const handleCreateBox = async () => {
    setErrorBox("");
    if (!boxTitle || !boxDescription || !boxArea) {
      setErrorBox("Parece que faltou preencher título, descrição ou área.");
      return;
    }
    if (boxDeadline && !isValidDate(boxDeadline)) {
      setErrorBox("A data informada não parece válida.");
      return;
    }

    const deadlineISO = boxDeadline ? formatDeadlineToTimestamptz(boxDeadline) : undefined;

    try {
      await insertBox(boxTitle, boxDescription, selectedId, deadlineISO);
      setBoxTitle(""); setBoxDescription(""); setBoxDeadline(""); setBoxArea(null);
      showToast("Box cadastrado com sucesso!");
      setTimeout(() => navigate("Boxes"), 2000);
    } catch (err) {
      console.error(err);
      showToast("Ops! Erro ao cadastrar box.");
    }
  };

  const handleAddItem = async () => {
    setErrorItem("");
    if (!itemTitle || !itemBox || !itemSubarea || !boxDeadline) {
      setErrorItem("Preencha todos os campos essenciais.");
      return;
    }
    if (!isValidDate(boxDeadline)) {
      setErrorItem("A data informada não parece válida.");
      return;
    }
    const selected = boxes.find(b => b.box_title === itemBox);
    if (!selected) {
      setErrorItem("Box inválido! Escolha uma opção da lista.");
      return;
    }
    const subareas: Subarea[] = await getSubarea(selected.box_area);
    const subarea = subareas.find(sa => sa.subarea_name === itemSubarea);
    const realizationDate = formatDeadlineToTimestamptz(boxDeadline) ?? undefined;

    try {
      await insertItem(
        itemTitle,
        itemDescription || "",
        itemPriority ? Number(itemPriority) : undefined,
        realizationDate,
        selected.id,
        subarea?.id ?? 0
      );
      setItemTitle(""); setItemDescription(""); setItemPriority("");
      setItemBox(null); setItemSubarea(null); setSubareaOptions([]); setBoxDeadline("");
      showToast("Item adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("Ops! Erro ao adicionar o item.");
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Vamos colocar suas ideias em movimento?</Text>
            <Text style={[styles.sectionLabel, { color: "#0b2545", marginBottom: 35 }]}>
              Escolha uma categoria para começar.
            </Text>

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
            <View style={{ flex: 1 }}>
              <View style={styles.formPanel}>
                <ScrollView contentContainerStyle={{ paddingBottom: 4 }}>
                  {tab === "Box" ? (
                    <BoxForm
                      boxTitle={boxTitle}
                      boxDescription={boxDescription}
                      boxDeadline={boxDeadline}
                      boxArea={boxArea}
                      errorBox={errorBox}
                      setBoxTitle={setBoxTitle}
                      setBoxDescription={setBoxDescription}
                      setBoxDeadline={(text) => setBoxDeadline(formatDateInput(text))}
                      openAreaPicker={openAreaPicker}
                      handleCreateBox={handleCreateBox}
                    />
                  ) : (
                    <ItemForm
                      itemTitle={itemTitle}
                      itemDescription={itemDescription}
                      itemPriority={itemPriority}
                      itemBox={itemBox}
                      itemSubarea={itemSubarea}
                      subareaOptions={subareaOptions}
                      boxDeadline={boxDeadline}
                      errorItem={errorItem}
                      setItemTitle={setItemTitle}
                      setItemDescription={setItemDescription}
                      setItemPriority={setItemPriority}
                      setBoxDeadline={(text) => setBoxDeadline(formatDateInput(text))}
                      openBoxPickerForItem={openBoxPickerForItem}
                      openSubareaPicker={openSubareaPicker}
                      handleAddItem={handleAddItem}
                    />
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

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
    marginTop: 5 
  },
  sectionLabel: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#758a93", 
    marginBottom: 5 
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
    elevation: 10 
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
    fontSize: 20 
  },
  tabTextInactive: { 
    color: "#0b2545", 
    fontWeight: "bold", 
    fontSize: 20 
  },
  formPanel: { 
    flexGrow: 1, 
    backgroundColor: "#0b2545", 
    paddingVertical: 30, 
    paddingHorizontal: 55, 
    minHeight: 650, 
    margin: -20,
    paddingBottom: 40
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
    borderBottomWidth: 0.5, 
    borderBottomColor: "#ccc" 
  },
  modalItemText: { 
    fontSize: 16 
  },
  modalClose: { 
    marginTop: 10, 
    alignItems: "center" 
  },
  modalCloseText: { 
    color: "#034078", 
    fontWeight: "bold" 
  },
});
