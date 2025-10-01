import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

export function getPlatformInfoString() {
  const info = {
    brand: Device.brand ?? 'unknown',
    model: Device.modelName ?? 'unknown',
    systemName: Device.osName ?? (Platform.OS === 'ios' ? 'iOS' : 'Android'),
    systemVersion: Device.osVersion ?? 'unknown',
    appVersion: Application.nativeApplicationVersion ?? 'unknown',
    buildNumber: Application.nativeBuildVersion ?? 'unknown',
  };
  return JSON.stringify(info);
}
