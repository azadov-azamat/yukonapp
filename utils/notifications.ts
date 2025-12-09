// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export function configureForegroundHandling() {
  Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export async function registerForPushAsync(projectId: string) {
  if (!Device.isDevice) return null;

  // iOS permission dialog
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  // Expo push token (Expo Push Service uchun)
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return token;
}

// Bosilgan notifikatsiyaga reaksiyalar (foreground/backg./cold-start)
export function addNotificationListeners(onReceive: (n: Notifications.Notification) => void,
                                         onRespond: (r: Notifications.NotificationResponse) => void) {
  const sub1 = Notifications.addNotificationReceivedListener(onReceive);
  const sub2 = Notifications.addNotificationResponseReceivedListener(onRespond);
  return () => { sub1.remove(); sub2.remove(); };
}

// App cold-start bo‘lsa, oxirgi bosilgan notifikatsiyani olib navigatsiya qilish
export async function getLastResponse() {
  return Notifications.getLastNotificationResponseAsync();
}
