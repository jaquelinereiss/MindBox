import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificationBell from "../components/NotificationBell";
import { useNotifications } from "../src/hooks/useNotifications";
import { supabase } from "../src/lib/supabaseClient";
import { CalendarDay, getCalendarByMonth, } from "../src/services/calendar/calendarService";
import getItemsByDate from "../src/services/items/getItemsByDate";
import { CalendarItem } from "../src/types/CalendarItem";
import ItemCard from "../components/ItemCard";

export default function CalendarScreen({ navigation }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [items, setItems] = useState<CalendarItem[]>([]);

  const today = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    loadUser();
  }, []);

  const notifications = useNotifications(userId);

  useEffect(() => {
    if (!currentDate) return;
    async function loadCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await getCalendarByMonth(year, month);
      if (response) {
        setCalendar(response.calendar);
        const isCurrentMonth =
          year === new Date().getFullYear() &&
          month === new Date().getMonth() + 1;
        setSelectedDate(isCurrentMonth ? today : null);
      }
    }
    loadCalendar();
  }, [currentDate]);

  useEffect(() => {
    async function loadItems() {
      if (!selectedDate || !userId) {
        setItems([]);
        return;
      }

      const data = await getItemsByDate(selectedDate, userId);
      setItems(sortByPriority(data));
    }

    loadItems();
  }, [selectedDate, userId]);

  const sortByPriority = (list: CalendarItem[]) => {
    const pending = list
      .filter((i) => !i.item_completed)
      .sort((a, b) => (a.priority_number ?? 0) - (b.priority_number ?? 0));
    const completed = list
      .filter((i) => i.item_completed)
      .sort(
        (a, b) =>
          new Date(b.realization_date ?? 0).getTime() -
          new Date(a.realization_date ?? 0).getTime()
      );
    return [...pending, ...completed];
  };

  const normalizeItem = (item: CalendarItem) => ({
    id: item.id,
    item_title: item.item_title,
    item_description: item.item_description,
    priority_number: item.priority_number,
    item_completed: item.item_completed,
    realization_date: item.realization_date ?? undefined,
    box_related: item.BOX.id,
  });

  const handleItemUpdated = (updatedItem: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((prev) =>
      sortByPriority(
        prev.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        )
      )
    );
  };

  const handleItemDeleted = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Calendário</Text>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <NotificationBell notifications={notifications} />
        </View>
      </View>

      <View style={styles.containerCalendar}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={28} color="#034078" />
        </TouchableOpacity>

        <View style={styles.calendarContainer}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Ionicons name="chevron-back" size={28} color="#034078" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentDate.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Ionicons name="chevron-forward" size={28} color="#034078" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendar.map((day, index) => {
              const isToday = day.date === today;
              const isSelected = day.date && day.date === selectedDate;
              const isSunday =
                day.date && new Date(day.date + "T00:00:00").getDay() === 0;

              return (
                <TouchableOpacity
                  key={`${day.date ?? "empty"}-${index}`}
                  disabled={!day.date}
                  onPress={() => {
                    if (!day.date) return;
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setSelectedDate(day.date);
                  }}
                  style={[
                    styles.dayBox,
                    !day.date && styles.emptyDay,
                    isToday && styles.todayDay,
                    isSelected && styles.selectedDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSunday && styles.sundayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {day.day ?? ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Atividades</Text>
        </View>

        <FlatList
          data={items.map(normalizeItem)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onItemUpdated={handleItemUpdated}
              onDeleteSuccess={handleItemDeleted}
              context="calendar"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 120,
          }}
          ListEmptyComponent={
            <Text style={styles.noItems}>
              Nenhum item foi encontrado para esta data.
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#134074" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 60,
    marginBottom: 40,
    backgroundColor: "#134074"
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#fff" 
  },
  addButton: {
    alignSelf: "center",
    marginTop: -25,
    padding: 10,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: "#ffffff"
  },
  containerCalendar: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopEndRadius: 40,
    backgroundColor: "#fff"
  },
  calendarContainer: { 
    paddingTop: 5, 
    paddingHorizontal: 20 
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  monthTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#034078" 
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5
  },
  weekDayText: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "700",
    color: "#6e7a8a"
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "flex-start",
    marginBottom: 20
  },
  dayBox: {
    width: "14.28%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent"
  },
  todayDay: { 
    borderColor: "#034078" 
  },
  selectedDay: { 
    backgroundColor: "#8da9c4" 
  },
  sundayText: { 
    fontWeight: "600", 
    color: "#b23a48" 
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    color: "#034078"
  },
  selectedDayText: { 
    fontWeight: "700", 
    color: "#fff" 
  },
  emptyDay: { 
    backgroundColor: "transparent" 
  },
  itemsContainer: { 
    alignItems: "center", 
    paddingHorizontal: 10 
  },
  separator: {
    height: 0.8,
    width: "50%",
    alignSelf: "center",
    marginBottom: 6,
    backgroundColor: "#ccd3da"
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 5,
    color: "#034078"
  },
  noItems: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
    color: "#666"
  },
});
