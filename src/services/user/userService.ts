import { supabase } from "../../lib/supabaseClient";
import { GetUserProfileResponse, Profile } from "../../types/User";

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const { data } = await supabase
    .from("PROFILES")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    email: user.email ?? "",
    profile: data,
  };
};

export const updateUserName = async (name: string): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome inválido");

  await supabase.auth.updateUser({
    data: { display_name: trimmed },
  });

  const { data } = await supabase
    .from("PROFILES")
    .upsert({ id: user.id, name: trimmed })
    .select()
    .single();

    if (!data) throw new Error("Perfil não encontrado");
    return data;
};
