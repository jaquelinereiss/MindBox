import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenName } from "../App";
import boxes from "../src/data/boxes.json";

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

  const areas = [
    "Carreira",
    "Casa e Organização",
    "Comunidade e Contribuição",
    "Conhecimento e Cultura",
    "Criatividade",
    "Desenvolvimento Pessoal",
    "Entretenimento",
    "Estudos",
    "Família",
    "Finanças",
    "Hobbies",
    "Lazer",
    "Outros",
    "Pets",
    "Relacionamentos",
    "Saúde e Bem-Estar",
    "Viagens"
  ];

  const openAreaPicker = () => {
    setPickerOptions(areas);
    setPickerOnSelect(() => (val: string) => {
      setBoxArea(val);
      setPickerVisible(false);
    });
    setPickerVisible(true);
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

  const openSubitemPicker = () => {
    if (!subitemOptions.length) return;
    setPickerOptions(subitemOptions);
    setPickerOnSelect(() => (val: string) => {
      setItemSubitem(val);
      setPickerVisible(false);
    });
    setPickerVisible(true);
  };

  const handleCreateBox = () => {
    if (!boxTitle || !boxArea) {
      alert("Defina pelo menos título e área.");
      return;
    }

    const iconByArea: Record<string, string> = {
      "Carreira": "briefcase",
      "Casa e Organização": "home",
      "Comunidade e Contribuição": "earth",
      "Conhecimento e Cultura": "book",
      "Criatividade": "sparkles",
      "Desenvolvimento Pessoal": "flower",
      "Entretenimento": "film",
      "Estudos": "school",
      "Família": "heart-half",
      "Finanças": "cash",
      "Hobbies": "extension-puzzle",
      "Lazer": "sunny",
      "Outros": "albums",
      "Pets": "paw",
      "Relacionamentos": "happy",
      "Saúde e Bem-Estar": "fitness",
      "Viagens": "airplane",
      Outro: "albums",
    };

    const payload = {
      title: boxTitle,
      description: boxDescription,
      deadline: boxDeadline,
      area: boxArea,
      icon: boxArea ? iconByArea[boxArea] || "albums-outline" : "albums-outline",
    };

    console.log("Criar box:", payload);

    setBoxTitle("");
    setBoxDescription("");
    setBoxDeadline("");
    setBoxArea(null);

    if (onNavigate) onNavigate("Boxes");
  };

  const handleAddItem = () => {
    if (!itemTitle || !itemBox) {
      alert("Defina pelo menos título e box.");
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
            <View style={styles.formPanel}>
              <ScrollView>
                {tab === "Box" ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Título"
                      value={boxTitle}
                      onChangeText={setBoxTitle}
                      placeholderTextColor="#bfcad5"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Descrição"
                      value={boxDescription}
                      onChangeText={setBoxDescription}
                      placeholderTextColor="#bfcad5"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Data prazo (opcional)"
                      value={boxDeadline}
                      onChangeText={setBoxDeadline}
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
                      placeholder="Título"
                      value={itemTitle}
                      onChangeText={setItemTitle}
                      placeholderTextColor="#bfcad5"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Descrição"
                      value={itemDescription}
                      onChangeText={setItemDescription}
                      placeholderTextColor="#bfcad5"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nº prioridade: 1 a 4 (opcional)"
                      value={itemPriority}
                      onChangeText={setItemPriority}
                      keyboardType="numeric"
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
                          {itemSubitem ? itemSubitem : "Subitem (escolha uma opção)"}
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
    marginBottom: 8 
  },
  section: { 
    paddingHorizontal: 20, 
    marginTop: 10 
  },
  sectionLabel: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  tabsRow: { 
    flexDirection: "row", 
    justifyContent: "center" 
  },
  tab: { 
    flex: 1, 
    padding: 40, 
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
    backgroundColor: "#0b2545", 
    padding: 20, borderRadius: 10, 
    marginHorizontal: 25 
  },
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 12, 
    fontSize: 15 
  },
  pickerBtn: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 12, 
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
    backgroundColor: "#134074",
    borderRadius: 80,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  submitButtonText: { 
    color: "#fff", 
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
