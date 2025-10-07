import { supabase } from '../lib/supabaseClient'

export default async function insertItem(title: string, description: string, priority: number | undefined , realization: string | undefined, box: number, subarea: number) {
  
    const { data, error } = await supabase
      .from('ITEM')
      .insert([
        {
          item_title: title, 
          item_description: description,
          priority_number: priority ?? 4,
          realization_date: realization,
          box_related: box,
          subarea_box: subarea
          
        }
      ])

    if (error) {
        console.error("Erro ao inserir item:", error.message)
    } else {
        console.log("Item inserido", data)
    }

    return null
}