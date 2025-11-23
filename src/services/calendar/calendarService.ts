export interface WeekData {
  month: string;
  days: string[];
  todayIndex: number;
}

export async function getCurrentWeek(): Promise<WeekData | null> {
  try {
    const response = await fetch("http://localhost:3000/calendar/currentWeek");
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
