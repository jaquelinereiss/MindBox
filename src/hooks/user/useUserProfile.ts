import { useState } from "react";
import { Profile } from "../../types/User";
import { getUserProfile, updateUserName } from "../../services/user/userService";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      
      setProfile(data.profile);
      setEmail(data.email);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    }
  };

  const updateName = async (name: string) => {
    const updated = await updateUserName(name);
    
    setProfile(updated);
  };

  return { profile, email, loadProfile, updateName };
};
