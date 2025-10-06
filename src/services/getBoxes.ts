import { supabase } from '../lib/supabaseClient'

export interface Box {
    id: number
    deadline_date: number
    box_title: string
    box_description: string
    box_area: number
}

export default async function getBoxes(): Promise<Box[]> {
  
    const { data, error } = await supabase
      .from('BOX')
      .select('id, deadline_date, box_title, box_description, box_area')

    if (error) {
      console.error("Erro ao buscar dados:", error)
    } else {
      console.log("Dados recebidos Box:", data)
    }

  return data as Box[]
}