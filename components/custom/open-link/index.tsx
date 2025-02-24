import React from 'react';
// import { Colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Text, Linking, Alert, View } from 'react-native';
import { useTheme } from '@/config/ThemeContext';

const OpenLink = ({ url, text = 'telegram', hasIcon = true, textClass }: {textClass?: string; url: string, text?: string; hasIcon?: boolean }) => {
  const { t } = useTranslation(); 
  const { theme } = useTheme();
  
  const handlePress = async () => {
    if (!url) {
      Alert.alert('Error', 'Telegram username is missing!');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Telegram app not installed!');
      }
    } catch (error) {
      console.error('Failed to open Telegram:', error);
      Alert.alert('Error', 'Unable to open Telegram.');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className='flex-row items-center space-x-2'>
             {hasIcon && <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="share-social" size={18} color={theme.colors.primary} /> 
              </View>}
              <Text className={`text-base text-blue-500 ${textClass}`}>
                {t (text)}
              </Text>
    </TouchableOpacity>
  );
};

export default OpenLink;
