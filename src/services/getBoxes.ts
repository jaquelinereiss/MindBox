import { supabase } from '../lib/supabaseClient'
import { Box } from '../types'

export default async function getBoxes(): Promise<Box[]> {
  const { data, error } = await supabase
    .from('BOX')
    .select(`
      id,
      box_title,
      box_area,
      box_description,
      deadline_date,
      AREA (area_name),
      ITEM(id)
    `)

  if (error) {
    console.error("Erro ao buscar boxes:", error)
    return []
  }

  // Mapeia o formato retornado (Supabase aninha o objeto AREA)
  const boxes: Box[] = (data || []).map((b: any) => ({
    id: b.id,
    box_title: b.box_title,
    box_area: b.box_area,
    box_description: b.box_description,
    area_name: b.AREA?.area_name || 'Área não informada',
    deadline_date: b.deadline_date,
    items_count: b.ITEM?.length || 0
  }))

  console.log("Boxes recebidos:", boxes)
  return boxes
}