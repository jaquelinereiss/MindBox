import { supabase } from '../../lib/supabaseClient';
import { Box } from '../../types/Box';

export default async function getBoxById(boxId: number): Promise<Box | null> {
  const { data, error } = await supabase
    .from('BOX')
    .select('id, box_title, box_area, box_description, deadline_date')
    .eq('id', boxId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    box_title: data.box_title,
    box_area: data.box_area,
    box_description: data.box_description ?? undefined,
    deadline_date: data.deadline_date ?? null,
  };
}
