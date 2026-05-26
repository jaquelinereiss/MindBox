import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import { Box } from "../../types/Box";
import getArea, { Area } from "../../services/areas/getArea";
import getSubarea, { Subarea } from "../../services/areas/getSubarea";
import getBoxes from "../../services/boxes/getBoxes";
import insertBox from "../../services/boxes/insertBox";
import insertItem from "../../services/items/insertItem";
import BoxForm from "../../components/forms/BoxForm";
import ItemForm from "../../components/forms/ItemForm";
import { useToast } from "../../components/feedback/ToastContext";
import BottomSheetCurved from "../../components/ui/BottomSheetCurved";
import { formatDateInput, formatDeadlineToTimestamptz, isValidDate } from "../../utils/date";
import SelectModal from "../../components/modals/SelectModal";

interface AddScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function AddScreen({ navigate }: AddScreenProps) {
  const [tab, setTab] = useState<"Box" | "Item" | "Item">("Box");

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
    const areaNames = areas.map((a) => a.area_name);
    setPickerOptions(areaNames);

    setPickerOnSelect(() => (name: string) => {
      const selected = areas.find((a) => a.area_name === name);
      if (selected) {
        setBoxArea(selected.area_name);
        setSelectedId(selected.id);
      }
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const openBoxPickerForItem = () => {
    const options = boxes.map((b) => b.box_title);
    setPickerOptions(options);

    setPickerOnSelect(() => async (boxTitle: string) => {
      setItemBox(boxTitle);
      setPickerVisible(false);

      const selected = boxes.find((b) => b.box_title === boxTitle);
      
      if (selected) {
        const subareas: Subarea[] = (await getSubarea(selected.box_area)) ?? [];
        setSubareaOptions(subareas.map((sa) => sa.subarea_name));
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

  const handleCreateBox = async () => {
    setErrorBox("");
    if (!boxTitle || !boxDescription || !boxArea) {
      setErrorBox("Preencha todos os campos essenciais.");
      return;
    }
    if (boxDeadline && !isValidDate(boxDeadline)) {
      setErrorBox("A data informada não parece válida.");
      return;
    }

    const deadlineISO = boxDeadline ? formatDeadlineToTimestamptz(boxDeadline) : undefined;

    try {
      await insertBox(boxTitle, boxDescription, selectedId, deadlineISO);
      setBoxTitle("");
      setBoxDescription("");
      setBoxDeadline("");
      setBoxArea(null);
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

    const selected = boxes.find((b) => b.box_title === itemBox);
    
    if (!selected) {
      setErrorItem("Box inválido! Escolha uma opção da lista.");
      return;
    }

    const subareas: Subarea[] = await getSubarea(selected.box_area);
    const subarea = subareas.find((sa) => sa.subarea_name === itemSubarea);
    const realizationDate = formatDeadlineToTimestamptz(boxDeadline) ?? undefined;

    try {
      await insertItem(
        itemTitle,
        itemDescription || "",
        itemPriority ? Number(itemPriority) : undefined,
        realizationDate,
        selected.id,
        subarea?.id ?? 0,
      );
      setItemTitle("");
      setItemDescription("");
      setItemPriority("");
      setItemBox(null);
      setItemSubarea(null);
      setSubareaOptions([]);
      setBoxDeadline("");
      showToast("Item adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("Ops! Erro ao adicionar o item.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Adicionar</Text>
        <Text style={styles.subtitle}>
          Vamos colocar suas ideias em movimento?
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BottomSheetCurved
          activeSide={tab === "Box" ? "left" : "right"}
          leftLabel="Box"
          rightLabel="Item"
          onLeftPress={() => setTab("Box")}
          onRightPress={() => setTab("Item")}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
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
        </BottomSheetCurved>
      </KeyboardAvoidingView>

      <SelectModal
        visible={pickerVisible}
        title="Selecione uma opção"
        options={pickerOptions}
        onSelect={pickerOnSelect}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b2545",
  },
  topHeader: {
    paddingVertical: 20,
    alignItems: "center",
    padding: 20,
    marginTop: 30,
    height: 130,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#c7d5ea",
    textAlign: "center",
    marginBottom: 10,
  },
});
