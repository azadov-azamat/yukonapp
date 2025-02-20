import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/utils/colors';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showToggle?: boolean;
  isToggled?: boolean;
  onToggle?: (value: boolean) => void;
}

export interface SettingsBottomSheetRef {
  open: () => void;
  close: () => void;
}

const SettingItem = ({ icon, title, onPress, showToggle, isToggled, onToggle }: SettingItemProps) => {
    const {t} = useTranslation();

    return (
        <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center px-4 py-3 border-b border-border-color dark:border-gray-700"
  >
    <View className="w-8">{icon}</View>
    <Text className="flex-1 ml-3 text-lg text-black dark:text-white">{t(title)}</Text>
    {showToggle ? (
      <Switch
        value={isToggled}
        onValueChange={onToggle}
      />
    ) : (
      <Ionicons name="chevron-forward" size={24} color="gray" />
    )}
    </TouchableOpacity>
)
}

interface SettingConfig {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  showToggle?: boolean;
  route?: string;
}

const SETTINGS_CONFIG: SettingConfig[] = [
  {
    icon: 'moon',
    title: 'Dark Mode',
    showToggle: true,
  },
  {
    icon: 'cart',
    title: 'profile.subscriptions',
    route: '/profile/subscriptions',
  },
  {
    icon: 'bookmark',
    title: 'profile.bookmarks',
    route: '/profile/bookmarks',
  },
  {
    icon: 'shield-outline',
    title: 'Privacy',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Security',
  },
  {
    icon: 'help-circle-outline',
    title: 'Help',
  },
  {
    icon: 'information-circle-outline',
    title: 'About',
  },
];

const SettingsBottomSheet = forwardRef<SettingsBottomSheetRef>((_, ref) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeName } = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: isDarkMode ? '#1F2937' : 'white',
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}
    >
      <BottomSheetView className="flex-1">
        <View className="pt-4">
          <Text className="px-4 pb-2 text-3xl font-bold text-gray-800 dark:text-white">
            Settings
          </Text>
          
          {SETTINGS_CONFIG.map((setting) => (
            <SettingItem
              key={setting.title}
              icon={
                <Ionicons 
                  name={setting.icon} 
                  size={24} 
                  color={Colors[themeName as keyof typeof Colors].tint} 
                />
              }
              title={setting.title}
              showToggle={setting.showToggle}
              isToggled={setting.showToggle ? isDarkMode : undefined}
              onToggle={setting.showToggle ? toggleTheme : undefined}
              onPress={setting.route ? () => {
                bottomSheetRef.current?.close();
                router.replace(setting.route! as RelativePathString);
              } : undefined}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SettingsBottomSheet;