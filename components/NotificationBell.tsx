import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '../src/hooks/useNotifications';

type Props = {
  notifications: Notification[];
};

export default function NotificationBell({ notifications }: Props) {
  const [show, setShow] = useState(false);
  const hasUnread = notifications.length > 0;

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity onPress={() => setShow(prev => !prev)}>
        <Ionicons name="notifications-outline" size={28} color="#fff" />
        {hasUnread && <View style={styles.notificationDot} />}
      </TouchableOpacity>

      {show && (
        <View style={styles.bubble}>
          {hasUnread ? (
            notifications.map(note => (
              <Text key={note.id} style={styles.bubbleText}>
                {note.message}
              </Text>
            ))
          ) : (
            <Text style={styles.bubbleText}>
              Você não possui notificações.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffb703'
  },
  bubble: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderEndStartRadius: 0,
    minWidth: 150,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100
  },
  bubbleText: {
    textAlign: 'center',
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: '#034078'
  },
});
