import React, { useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RelativePathString, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/utils/colors';
import RuIcon from "@/assets/svg/ru.svg";
import UzIcon from "@/assets/svg/uz.svg";
import UzCyrlIcon from "@/assets/svg/uz-Cyrl.svg";

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
    className={`flex-row items-center px-4 py-3 border-b border-border-color dark:border-gray-700`}
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
    icon: 'moon-outline',
    title: 'Dark Mode',
    showToggle: true,
  },
  {
    icon: 'cart-outline',
    title: 'profile.subscriptions',
    route: '/profile/subscriptions',
  },
  {
    icon: 'bookmark-outline',
    title: 'profile.bookmarks',
    route: '/profile/bookmarks',
  },
  {
    icon: 'shield-outline',
    title: 'Privacy',
  },
  {
    icon: 'help-circle-outline',
    title: 'Help',
  }
];

const SettingsBottomSheet = forwardRef<SettingsBottomSheetRef>((_, ref) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeName } = useTheme();
  const { i18n } = useTranslation();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const languages = [
    { code: "ru", label: "Русский", icon: RuIcon },
    { code: "uz", label: "O'zbekcha", icon: UzIcon },
    { code: "uz-Cyrl", label: "Ўзбекча", icon: UzCyrlIcon },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    bottomSheetRef.current?.close();
  };
  
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
      <BottomSheetView className="flex-1 dark">
        <View className="pt-4">
          <Text className="px-4 pb-2 text-3xl font-bold text-black dark:text-white">
            Settings
          </Text>
          
          {SETTINGS_CONFIG.map((setting) => (
            <SettingItem
              key={setting.title}
              icon={
                <Ionicons 
                  name={(isDarkMode ? setting.icon.replace('-outline', '') : setting.icon) as keyof typeof Ionicons.glyphMap} 
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

          <View className="flex-row justify-around px-4 my-2">
            {languages.map((item) => (
              <TouchableOpacity 
                key={item.code} 
                onPress={() => handleLanguageChange(item.code)} 
                className={`items-center p-3 rounded-lg ${
                  item.code === i18n.language ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
              >
                <item.icon width={32} height={32} />
                <Text className="mt-1 text-sm text-black dark:text-white">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SettingsBottomSheet;