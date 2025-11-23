import { supabase } from "../../lib/supabaseClient";
import { Item } from "../../navigation/types";

const updateItem = async (id: number, updatedData: Partial<Item>) => {
  try {
    console.log("Dados recebidos para atualização:", updatedData);
      const cleanData = Object.fromEntries(
        Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    const { data, error } = await supabase
      .from("ITEM")
      .update(cleanData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erro ao atualizar item:", error);
      throw error;
    }

    console.log("Item atualizado com sucesso:", data);
    return data;
  } catch (error) {
      console.error("Erro ao atualizar item:", error);
      throw new Error("Erro ao atualizar item");
  }
};

export default updateItem;