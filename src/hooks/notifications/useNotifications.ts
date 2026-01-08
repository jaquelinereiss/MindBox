import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export type Notification = {
  id: string;
  type: 'overdue' | 'info' | 'warning';
  message: string;
  read: boolean;
};

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      const { data } = await supabase
        .from('ITEM')
        .select('*')
        .eq('user_id', userId);

      if (!data) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const hasOverdue = data.some((item: any) => {
        if (item.item_completed || !item.realization_date) return false;
        const itemDate = new Date(item.realization_date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate < today;
      });

      if (hasOverdue) {
        setNotifications([
          {
            id: 'overdue-1',
            type: 'overdue',
            message: 'Ei, você possui itens atrasados precisando da sua atenção.',
            read: false,
          },
        ]);
      } else {
        setNotifications([]);
      }
    }

    fetchNotifications();
  }, [userId]);

  return notifications;
}
