import { supabase } from '../lib/supabaseClient'
import { Box } from '../types'

export default async function getBoxes(): Promise<Box[]> {
  const { data, error } = await supabase
    .from('BOX')
    .select('id, box_title, box_area, box_description')

  if (error) {
    console.error("Erro ao buscar boxes:", error)
    return []
  }

  console.log("Boxes recebidos:", data)
  return data as Box[]
}
