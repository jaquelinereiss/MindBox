const BASE_URL = process.env.EXPO_PUBLIC_CALENDAR_API!;

export interface WeekData {
  month: string;
  days: string[];
  todayIndex: number;
}

export async function getCurrentWeek(): Promise<WeekData | null> {
  try {
    const response = await fetch(`${BASE_URL}/calendar/currentWeek`);
    if (!response.ok) {
      throw new Error("Erro ao buscar calendário");
    }
    const data: WeekData = await response.json();
    return data;
  } catch (error) {
    console.error("Erro no calendarService:", error);
    return null;
  }
}
