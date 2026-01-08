import { useState, useEffect } from "react";
import { CalendarDay, getCalendarByMonth } from "../../services/calendar/calendarService";

export function useCalendarMonth() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
  async function loadCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const response = await getCalendarByMonth(year, month);

    if (response) {
      setCalendar(response.calendar);

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const isCurrentMonth =
        year === today.getFullYear() && month === today.getMonth() + 1;

      setSelectedDate(prev => (prev ? prev : isCurrentMonth ? todayStr : null));
    }
  }

  loadCalendar();
}, [currentDate]);

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return { currentDate, calendar, selectedDate, setSelectedDate, handlePrevMonth, handleNextMonth };
}
