import { supabase } from '../../lib/supabaseClient'

export default async function insertBox(title: string, description: string, area: number | undefined, deadline?: string | null) {
  
    const { data, error } = await supabase
      .from('BOX')
      .insert([
        {
          box_title: title, 
          box_description: description,
          deadline_date: deadline ? deadline : null,
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