import { supabase } from "../../lib/supabaseClient";

export const profileService = {
  async updateAvatar(userId: string, avatarUrl: string) {
    const { error } = await supabase
      .from("PROFILES")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  },

  async removeAvatar(userId: string) {
    const { error } = await supabase
      .from("PROFILES")
      .update({ avatar_url: null })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  },
};