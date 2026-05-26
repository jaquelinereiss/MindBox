import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../../../App";
import { supabase } from "../../lib/supabaseClient";
import { getDashboardData } from "../../services/dashboard/getDashboardData";
import { getCurrentWeek, WeekData } from "../../services/calendar/calendarService";
import { getTodayItems } from "../../services/items/getTodayItems";
import Header from "../../components/layout/Header";
import WeeklyCalendar from "../../components/features/calendar/WeeklyCalendar";
import TodayItems from "../../components/features/items/TodayItems";
import DashboardCard from "../../components/cards/DashboardCard";
import ActionCard from "../../components/cards/ActionCard";

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
  const [expanded, setExpanded] = useState(false);
  const remaining = allItems.length - todayItems.length;
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
      setTodayItems(allItems.slice(0, 2));
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
      if (week) {
        setWeekData({
          month: week.month,
          days: week.days,
          todayIndex: new Date().getDay(),
        });
      }
      const items = await getTodayItems(user.id);
      setAllItems(items);
      setTodayItems(items.slice(0, 2));
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
            onPress={() => navigate("Calendar")}
          />
        )}

        <TodayItems
          items={todayItems}
          remaining={remaining}
          expanded={expanded}
          onShowRemaining={handleToggleItems}
          onSeeMore={() => navigate("Calendar")}
          onPress={() => navigate("Calendar")}
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
          <ActionCard iconName="checkbox-outline" title="Checklist" subtitle="organize suas tarefas do dia a dia" />
          <ActionCard iconName="alarm-outline" title="Lembretes" subtitle="não dependa apenas da memória" />
          <ActionCard iconName="flag-outline" title="Metas" subtitle="planeje seus próximos passos" />
          <ActionCard iconName="star-outline" title="Favoritos" subtitle="guarde o que é importante" />
          <ActionCard iconName="help-circle-outline" title="Ajuda" subtitle="estou aqui para te ajudar" />
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
    marginHorizontal: 30
  },
});
