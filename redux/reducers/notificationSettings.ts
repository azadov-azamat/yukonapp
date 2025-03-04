import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  newsEnabled: boolean;
  adsEnabled: boolean;
  textMessagesEnabled: boolean;
}

const initialState: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  newsEnabled: true,
  adsEnabled: true,
  textMessagesEnabled: true,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    togglePushNotifications: (state) => {
      state.pushEnabled = !state.pushEnabled;
    },
    toggleEmailNotifications: (state) => {
      state.emailEnabled = !state.emailEnabled;
    },
    toggleNewsNotifications: (state) => {
      state.newsEnabled = !state.newsEnabled;
    },
    toggleAdsNotifications: (state) => {
      state.adsEnabled = !state.adsEnabled;
    },
    toggleTextMessageNotifications: (state) => {
      state.textMessagesEnabled = !state.textMessagesEnabled;
    },
    updateSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  togglePushNotifications,
  toggleEmailNotifications,
  toggleNewsNotifications,
  toggleAdsNotifications,
  toggleTextMessageNotifications,
  updateSettings,
} = notificationSettingsSlice.actions;

export default notificationSettingsSlice.reducer;
