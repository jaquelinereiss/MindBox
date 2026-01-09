import { useState }  from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthUser } from "../src/hooks/auth/useAuthUser";
import NotificationBell from "../components/NotificationBell";
import { useNotifications } from "../src/hooks/notifications/useNotifications";
import { useCalendarMonth } from "../src/hooks/calendar/useCalendarMonth";
import { useCalendarItems } from "../src/hooks/calendar/useCalendarItems";
import ItemCard from "../components/ItemCard";
import AddItemModal from "../components/AddItemModal";

export default function CalendarScreen({ navigation }: any) {
  const userId = useAuthUser();
  const notifications = useNotifications(userId);
  const [addItemVisible, setAddItemVisible] = useState(false);

  const {
    currentDate,
    calendar,
    selectedDate,
    setSelectedDate,
    handlePrevMonth,
    handleNextMonth,
  } = useCalendarMonth();

  const { items, reloadItems, handleItemUpdated, handleItemDeleted, normalizeItem } =
    useCalendarItems(selectedDate, userId);

  const today = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddItemVisible(true)}
        >
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
              const isSelected = day.date === selectedDate;
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
      <AddItemModal
        visible={addItemVisible}
        onClose={() => setAddItemVisible(false)}
        boxId={undefined}
        onItemCreated={() => {
          reloadItems();
          setAddItemVisible(false);
        }}
      />
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
