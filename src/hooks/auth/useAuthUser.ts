import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useAuthUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    loadUser();
  }, []);

  return userId;
}
