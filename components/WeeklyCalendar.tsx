import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface WeeklyCalendarProps {
  month: string;
  days: string[];
  activeIndex?: number;
}

export default function WeeklyCalendar({
  month,
  days,
  activeIndex = 0,
}: WeeklyCalendarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionMonth}>{month}</Text>

      <View style={styles.weekContainer}>
        {days.map((day, index) => {
          const isActive = index === activeIndex;
          return (
            <View
              key={day}
              style={[styles.dayBubble, isActive && styles.dayBubbleActive]}
            >
              <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                {day.split(" ")[0]}
              </Text>
              <Text
                style={[styles.dayNumber, isActive && styles.dayNumberActive]}
              >
                {day.split(" ")[1]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b2545",
    marginTop: 10,
    marginLeft: 30
  },
  sectionMonth: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#034078",
    marginLeft: 30,
    marginTop: 15
  },
  weekContainer: {
    width: "85%",
    marginLeft: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 5
  },
  dayBubble: {
    width: 45,
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  dayBubbleActive: {
    backgroundColor: "#034078"
  },
  dayText: {
    fontSize: 12,
    color: "#666"
  },
  dayTextActive: {
    fontWeight: "bold",
    color: "#eef4ed"
  },
  dayNumber: {
    fontSize: 12,
    color: "#666"
  },
  dayNumberActive: {
    fontWeight: "bold",
    color: "#eef4ed"
  }
});
