import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { supabase } from "../src/lib/supabaseClient";
import { getDashboardData } from "../src/services/dashboard/getDashboardData";
import { getCurrentWeek, WeekData } from "../src/services/calendar/calendarService";
import { getTodayItems } from "../src/services/items/getTodayItems";
import Header from "../components/Header";
import WeeklyCalendar from "../components/WeeklyCalendar";
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
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [allItems, setAllItems] = useState<{ title: string; subtitle: string }[]>([]);
  const [todayItems, setTodayItems] = useState<{ title: string; subtitle: string }[]>([]);
  const remaining = allItems.length - todayItems.length;
  const [expanded, setExpanded] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalBoxes: 0,
    totalItems: 0,
    overallProgress: 0,
    averageProgress: 0,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const handleToggleItems = () => {
    if (!expanded) {
      setTodayItems(allItems);
      setExpanded(true);
    } else {
      const limited = allItems.slice(0, 2);
      setTodayItems(limited);
      setExpanded(false);
    }
  };

  useEffect(() => {
    async function loadAllInformation() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const name = user.user_metadata?.display_name;
      if (name) setDisplayName(name);

      const dashboard = await getDashboardData(user.id);
      setDashboardData(dashboard);
      setLoadingDashboard(false);

      const week = await getCurrentWeek();
      setWeekData(week);

      const items = await getTodayItems(user.id);
      setAllItems(items);

      const limited = items.slice(0, 2);
      setTodayItems(limited);
    }

    loadAllInformation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onAdd={handleAdd} displayName={displayName} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>O que vamos fazer hoje?</Text>

        {weekData && (
          <WeeklyCalendar
            month={weekData.month}
            days={weekData.days}
            activeIndex={weekData.todayIndex}
          />
        )}

        <TodayItems
          items={todayItems}
          remaining={remaining} 
          expanded={expanded} 
          onShowRemaining={handleToggleItems} 
          onSeeMore={() => console.log("'ver tudo' foi clicado")}
        />

        <DashboardCard
          loading={loadingDashboard}
          boxCount={dashboardData.totalBoxes}
          itemCount={dashboardData.totalItems}
          progressPercent={Math.round(dashboardData.overallProgress * 100)}
          onPress={handleDashboard}
        />

        <Text style={styles.sectionMore}>Confira mais opções:</Text>
        <View style={styles.moreList}>
          <ActionCard iconName="star-outline" title="Favoritos" subtitle="onde ficam suas preciosidades" />
          <ActionCard iconName="flag-outline" title="Metas" subtitle="seus planos mais ambiciosos" />
          <ActionCard iconName="alarm-outline" title="Lembretes" subtitle="confiar apenas na memória é arriscado" />
          <ActionCard iconName="help-circle-outline" title="Ajuda" subtitle="tem dúvidas? vem comigo!" />
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
