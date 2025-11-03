import { supabase } from "../lib/supabaseClient";

/**
 * Exclui um item específico do banco de dados.
 * 
 * @param itemId - ID do item que será deletado.
 * @returns Retorna { data, error } da operação do Supabase.
 */
export default async function deleteItem(itemId: string | number) {
  try {
    const { data, error } = await supabase
      .from("ITEM")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Erro ao deletar item:", error);
    return { data: null, error };
  }
}
