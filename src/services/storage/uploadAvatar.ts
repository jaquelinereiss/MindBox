import { decode } from "base64-arraybuffer";
import { supabase } from "../../lib/supabaseClient";

export const uploadAvatar = async (userId: string, base64: string) => {
  const filePath = `${userId}/${Date.now()}.png`;

  const { error } = await supabase.storage
    .from("AVATARS")
    .upload(filePath, decode(base64), {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("AVATARS")
    .getPublicUrl(filePath);

  return data.publicUrl;
};