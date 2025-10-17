import { supabase } from '../lib/supabaseClient'
import { Item } from '../types'

export default async function getItems(box_id: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('ITEM')
    .select('id, item_title, item_description, priority_number, box_related, subarea_box, realization_date, item_completed')
    .eq('box_related', box_id)

  if (error) {
    console.error("Erro ao buscar itens:", error)
    return []
  }

  console.log("Itens recebidos:", data)
  return data as Item[]
}
