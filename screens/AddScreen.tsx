import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenName } from "../App";
import boxes from "../src/data/boxes.json";
import insertBox from "../src/services/insertBox"
import getArea, { Area } from "../src/services/getArea";

interface AddScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

const subitemsByArea: Record<string, string[]> = {
  "Carreira": [ "Artigos", "Atividades", "Documentos", "Planejamento de carreira", "Projetos profissionais", "Relatórios", "Reuniões"],
  "Casa e Organização": [ "Arrumação", "Compras", "Decoração", "Jardinagem", "Limpeza", "Manutenção", "Reforma", "Tarefas domésticas" ],
  "Comunidade e Contribuição": [ "Doações", "Eventos comunitários", "Projetos sociais", "Reuniões", "Voluntariado" ],
  "Conhecimento e Cultura": [ "Aprendizado online", "Cursos", "Eventos Sociais", "Leitura", "Pesquisas", "Projetos culturais" ],
  "Criatividade": [ "Arte", "Design", "Escrita", "Ideias", "Inspirações", "Projetos" ],
  "Desenvolvimento Pessoal": [ "Autoconhecimento", "Diário", "Metas pessoais", "Projetos pessoais" ],
  "Entretenimento": [ "Animes", "Filmes", "Jogos", "Séries" ],
  "Estudos": [ "Artigos", "Atividades", "Cursos", "Documentários", "Documentos", "Estudos", "Leitura", "Livros", "Simulados", "Video aula" ],
  "Família": [ "Atividades", "Compromissos familiares", "Eventos familiares", "Rotina", "Visitas familiares" ],
  "Finanças": [ "Economias", "Gastos", "Investimentos", "Orçamento", "Pagamentos", "Planejamento financeiro" ],
  "Hobbies": [ "Dança", "Desenho", "Escrita", "Fotografia", "Jogos", "Leitura", "Música", "Pintura", "Artes Marciais", "Gastronomia", "Astronomia" ],
  "Lazer": [ "Experiências", "Férias", "Passeios" ],
  "Outros": [ "Diversos", "Lembretes", "Metas", "Planejamento", "Tarefas Aleatórias"],
  "Pets": [ "Brincadeiras", "Cuidados", "Passeios", "Rotina", "Saúde" ],
  "Relacionamentos": [ "Amigos", "Comunicação", "Eventos sociais", "Networking" ],
  "Saúde e Bem-Estar": [ "Alimentação", "Check-up", "Descanso", "Exercícios", "Meditação", "Saúde física", "Saúde mental", "Sono", "Terapia" ],
  "Viagens": [ "Destinos", "Hospedagem", "Passagens", "Preparativos", "Reservas", "Roteiros" ]
};


export default function AddScreen({ onNavigate }: AddScreenProps) {
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

  const getAreas = async () => {
    try {
      const area: Area[] = await getArea();
      setAreas(area);
    } catch (error) {
      console.error('Ops! Erro ao abrir o modal de áreas:', error)
    }
  }

  useEffect(()=>{
    getAreas();
  },[])

  const openAreaPicker = async () => {
    try {
      const areaNames = areas.map((a) => a.area_name);
      setPickerOptions(areaNames);

      setPickerOnSelect(() => (areaNames: string) => {
      const selectedArea = areas.find(area => area.area_name === areaNames);
      if (selectedArea) {
        setBoxArea(selectedArea.area_name);
        setSelectedId(selectedArea.id);
      }
      setPickerVisible(false);
    });

    setPickerVisible(true);
    } catch (error) {
      console.error('Ops! Erro ao abrir o modal de áreas:', error)
    }
  };

  const openBoxPickerForItem = () => {
    const options = boxes.map((b) => b.title);
    setPickerOptions(options);
    setPickerOnSelect(() => (val: string) => {
      setItemBox(val);
      setPickerVisible(false);

      const box = boxes.find((b) => b.title === val);
      if (box && box.area && subitemsByArea[box.area]) {
        setSubitemOptions(subitemsByArea[box.area]);
        setItemSubitem(null);
      } else {
        setSubitemOptions([]);
        setItemSubitem(null);
      }
    });
    setPickerVisible(true);
  };

  const formatDeadlineToTimestamptz = (input: string) => {
    if (!input) return null;

    const numberOnly = input.replace(/\D/g, "");
    if (numberOnly.length !==8) return null;

    const day = numberOnly.substring(0,2);
    const month = numberOnly.substring(2,4);
    const year = numberOnly.substring(4,8);

    const isoString = new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
    return isoString;
  }

  const formatDateInput = (value: string) => {

    const numberOnly = value.replace(/\D/g, "");

    const limited = numberOnly.substring(0, 8);

    let formatted = "";

    if (limited.length <= 2) {
        formatted = limited; // apenas dia
      }   else if (limited.length <= 4) {
        formatted = `${limited.substring(0,2)}/${limited.substring(2,4)}`; // dd/mm
      } else {
        formatted = `${limited.substring(0,2)}/${limited.substring(2,4)}/${limited.substring(4,8)}`; // dd/mm/yyyy
    }

    return formatted;
  };

  const isValidDate = (dateStr: string) => {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    if (!dayStr || !monthStr || !yearStr) return false;

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const handleCreateBox = () => {
    if (!boxTitle || !boxArea || !boxDescription) {
      alert("Informe título, descrição e área, meu anjo!");
      return;
    }

    if (boxDeadline && !isValidDate(boxDeadline)) {
      alert('Informe uma data válida, meu anjo!');
      return;
    }

    const deadlineTimestamptz = boxDeadline ? formatDeadlineToTimestamptz(boxDeadline): null;
    setBoxTitle("");
    setBoxDescription("");
    setBoxDeadline("");
    setBoxArea(null);
    insertBox(boxTitle, boxDescription, selectedId, deadlineTimestamptz);

    if (onNavigate) onNavigate("Boxes");
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

  const handleAddItem = () => {
    if (!itemTitle || itemDescription || !itemBox) {
      alert("Defina um título, descrição e box, meu anjo!");
      return;
    }

    const payload = {
      title: itemTitle,
      description: itemDescription,
      priority: itemPriority,
      box: itemBox,
      subitem: itemSubitem,
    };

    console.log("Adicionar item:", payload);

    setItemTitle("");
    setItemDescription("");
    setItemPriority("");
    setItemBox(null);
    setItemSubitem(null);
    setSubitemOptions([]);

    if (onNavigate) onNavigate("Boxes");
  };

  const PickerModal = () => (
    <Modal visible={pickerVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FlatList
            data={pickerOptions}
            keyExtractor={(item, idx) => String(item) + idx}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => pickerOnSelect(item)}
              >
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
                    onChangeText={setItemPriority}
                    keyboardType="numeric"
                    placeholderTextColor="#bfcad5"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Informe uma data de realização"
                    value={boxDeadline}
                    onChangeText={setBoxDeadline}
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
    marginHorizontal: 15 
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
