import { useState } from "react";
import { userService } from "../../services/user/userService";
import { profileService } from "../../services/user/avatarService";
import { pickImage } from "../../utils/media/imagePicker";
import { uploadAvatar } from "../../services/storage/uploadAvatar";
import { supabase } from "../../lib/supabaseClient";

type AvatarResult =
  | { success: true; photoUrl: string }
  | { success: false; type: "cancelled" }
  | { success: false; type: "error"; message: string };

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState("");

  const loadProfile = async () => {
    const { user, profile } = await userService.getProfile();

    setProfile(profile);
    setEmail(user.email ?? "");
  };

  const updateName = async (name: string) => {
    const updated = await userService.updateName(name);
    setProfile((prev: any) => ({
      ...prev,
      ...updated,
    }));
  };

  const updateAvatar = async (): Promise<AvatarResult> => {
    if (!profile?.id) {
      return { success: false, type: "error", message: "Usuário não encontrado" };
    }

    const image = await pickImage();

    if (!image) {
      return { success: false, type: "cancelled" };
    }

    const photoUrl = await uploadAvatar(profile.id, image.base64!);

    await profileService.updateAvatar(profile.id, photoUrl);

    setProfile((prev: any) => ({
      ...prev,
      avatar_url: photoUrl,
    }));

    return { success: true, photoUrl };
  };

  const removeAvatar = async () => {
    if (!profile?.id) return;

    await profileService.removeAvatar(profile.id);

    setProfile((prev: any) => ({
      ...prev,
      avatar_url: null,
    }));
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!email) throw new Error("Email não encontrado");

    const login = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (login.error) {
      throw new Error("Senha atual incorreta");
    }

    const update = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (update.error) {
      throw new Error("Erro ao atualizar senha");
    }
  };

  return {
    profile,
    email,
    loadProfile,
    updateName,
    updateAvatar,
    removeAvatar,
    updatePassword,
  };
}