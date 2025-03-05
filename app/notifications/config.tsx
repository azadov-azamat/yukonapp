import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import {
  togglePushNotifications,
  toggleEmailNotifications,
  toggleNewsNotifications,
  toggleAdsNotifications,
  toggleTextMessageNotifications,
} from '@/redux/reducers/notificationSettings';

export default function NotificationsConfigScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.notificationSettings);

  const handleToggle = (action: any) => {
    dispatch(action());
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('notifications.preferences')}</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('notifications.pushNotifications')}</Text>
          <Switch
            value={settings.pushEnabled}
            onValueChange={() => handleToggle(togglePushNotifications)}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('notifications.emailNotifications')}</Text>
          <Switch
            value={settings.emailEnabled}
            onValueChange={() => handleToggle(toggleEmailNotifications)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('notifications.types')}</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('notifications.newsUpdates')}</Text>
          <Switch
            value={settings.newsEnabled}
            onValueChange={() => handleToggle(toggleNewsNotifications)}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('notifications.promotionalAds')}</Text>
          <Switch
            value={settings.adsEnabled}
            onValueChange={() => handleToggle(toggleAdsNotifications)}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('notifications.textMessages')}</Text>
          <Switch
            value={settings.textMessagesEnabled}
            onValueChange={() => handleToggle(toggleTextMessageNotifications)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#444',
  },
});
