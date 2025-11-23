import { supabase } from "../../lib/supabaseClient";

/**
 * Exclui o box e todos os itens relacionados a ele
 * @param boxId: id do box a ser deletado
 */
export default async function deleteBox(boxId: number) {
  try {
    // Deleta os itens do box
    const { error: itemError } = await supabase
      .from("ITEM")
      .delete()
      .eq("box_related", boxId);

    if (itemError) throw itemError;

    // Deleta o box
    const { error: boxError } = await supabase
      .from("BOX")
      .delete()
      .eq("id", boxId);

    if (boxError) throw boxError;

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar box e seus itens:", error);
    return { success: false, error };
  }
}