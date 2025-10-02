import { supabase } from '../lib/supabaseClient'

export default async function insertBox(title: string, description: string, area: string) {
  
    const { data, error } = await supabase
      .from('BOX')
      .insert([
        {
          box_title: title, 
          box_description: description,
          deadline_date: new Date(),
          box_area: area
        }
      ])

    if (error) {
      console.error("Erro ao buscar dados:", error)
    } else {
      console.log("Dados recebidos:", data)
    }

  return null
}