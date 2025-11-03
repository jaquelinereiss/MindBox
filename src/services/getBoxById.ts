import { supabase } from '../lib/supabaseClient';

export interface Box {
  id: number;
  box_title: string;
  box_area: number;
  box_description?: string;
  deadline_date?: string;
}

export default async function getBoxById(boxId: number): Promise<Box | null> {
  try {
    const { data, error } = await supabase
      .from('BOX')
      .select('id, box_title, box_area, box_description, deadline_date')
      .eq('id', boxId)
      .single();

    if (error) {
      console.error("Erro ao buscar box por ID:", error);
      return null;
    }

    if (!data) {
      console.error("Box não encontrado para ID:", boxId);
      return null;
    }

    return {
      id: data.id,
      box_title: data.box_title,
      box_area: data.box_area,
      box_description: data.box_description ?? undefined,
      deadline_date: data.deadline_date ?? undefined,
    };
  } catch (err) {
    console.error("Erro inesperado ao buscar box por ID:", err);
    return null;
  }
}