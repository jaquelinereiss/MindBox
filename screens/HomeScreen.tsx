import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { supabase } from "../src/lib/supabaseClient";
import { getDashboardData } from "../src/services/getDashboardData";
import Header from "../components/Header";
import WeeklyCalendar from "../components/WeeklyCalendar"
import TodayItems from "../components/TodayItems";
import DashboardCard from "../components/DashboardCard";
import ActionCard from "../components/ActionCard";

interface HomeScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function HomeScreen({ navigate }: HomeScreenProps) {
  const handleAdd = () => navigate("Add");
  const handleDashboard = () => navigate("Dashboard");

  const [displayName, setDisplayName] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalBoxes: 0,
    totalItems: 0,
    overallProgress: 0,
    averageProgress: 0,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);


  useEffect(() => {
    async function loadUserAndDashboard() {
      const { data: userData } = await supabase.auth.getUser();
      const name = userData?.user?.user_metadata?.display_name;
      if (name) setDisplayName(name);

      if (!userData.user) return;

      setLoadingDashboard(true);
      const data = await getDashboardData(userData.user.id);
      setDashboardData(data);
      setLoadingDashboard(false);
    }

    loadUserAndDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onAdd={handleAdd} displayName={displayName} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        
        <Text style={styles.sectionTitle}>O que vamos fazer hoje?</Text>

        <WeeklyCalendar 
          month="Novembro 2025"
          days={["Dom 16", "Seg 17", "Ter 18", "Qua 19", "Qui 20", "Sex 21", "Sab 22"]}
          activeIndex={1}
        />

        <TodayItems
        items={[
            { title: "nome item 1", subtitle: "nome do box 1" },
            { title: "nome item 2", subtitle: "nome do box 2" },
          ]}
          onSeeMore={() => console.log("Ver tudo clicado")}
        />

        <DashboardCard
          loading={loadingDashboard}
          boxCount={dashboardData.totalBoxes}
          itemCount={dashboardData.totalItems}
          progressPercent={Math.round(dashboardData.overallProgress * 100)}
          onPress={handleDashboard}
        />

        <View>
          <Text style={styles.sectionMore}>Confira mais opções:</Text>
          <View style={styles.moreList}>
            <ActionCard
              iconName="star-outline"
              title="Favoritos"
              subtitle="onde ficam suas preciosidades"
            />
            <ActionCard
              iconName="flag-outline"
              title="Metas"
              subtitle="seus planos mais ambiciosos"
            />
            <ActionCard
              iconName="alarm-outline"
              title="Lembretes"
              subtitle="confiar apenas na memória é arriscado"
            />
            <ActionCard
              iconName="help-circle-outline"
              title="Ajuda"
              subtitle="Tem dúvidas? Vem comigo!"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ed"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b2545",
    marginTop: 10,
    marginLeft: 30
  },
  sectionMore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b2545",
    marginTop: 10,
    marginLeft: 30
  },
  moreList: {
    marginTop: 10,
    marginHorizontal: 30,
    backgroundColor: "#eef4ed00"
  }
});
