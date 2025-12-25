const BASE_URL = process.env.EXPO_PUBLIC_CALENDAR_API!;

export interface WeekData {
  month: string;
  days: string[];
  todayIndex: number;
}

export interface CalendarDay {
  date: string | null;
  day: number | null;
  dayOfWeek: number;
  isWeekend: boolean;
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  totalDays: number;
  calendar: CalendarDay[];
}

/**
 * Semana corrente
 */
export async function getCurrentWeek(): Promise<WeekData | null> {
  try {
    const response = await fetch(`${BASE_URL}/calendar/currentWeek`);

    if (!response.ok) {
      throw new Error("Erro ao buscar semana atual");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no getCurrentWeek:", error);
    return null;
  }
}

/**
 * Calendário por ano e mês
 */
export async function getCalendarByMonth(
  year: number,
  month: number
): Promise<CalendarMonthResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/calendar/${year}/${month}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar calendário mensal");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no getCalendarByMonth:", error);
    return null;
  }
}
