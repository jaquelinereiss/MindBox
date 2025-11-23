import { supabase } from '../../lib/supabaseClient'

export default async function completeItem(id: number, isCompleted: boolean) {
  
    const { data, error } = await supabase
      .from('ITEM')
      .update(
        {
          item_completed: isCompleted,
          completed_date: isCompleted ? new Date().toISOString() : null
        }
      )
      .eq("id", id)

    if (error) {
        console.error("Erro ao realizar atualizar item:", error.message)
    } else {
        console.log("Item atualizado com sucesso", data)
    }

    return {data, error}
}