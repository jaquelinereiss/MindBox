import { supabase } from "../../lib/supabaseClient";

export const userService = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado");

    const { data } = await supabase
      .from("PROFILES")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile: data };
  },

  async updateName(name: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado");

    const { data } = await supabase
      .from("PROFILES")
      .update({ name })
      .eq("id", user.id)
      .select()
      .single();

    return data;
  },
};