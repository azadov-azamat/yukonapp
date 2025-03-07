import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@/config/ThemeContext';
import { openLink } from '@/utils/general';

const OpenLink = ({ url, text = 'telegram', hasIcon = true, textClass }: {textClass?: string; url: string, text?: string; hasIcon?: boolean }) => {
  const { t } = useTranslation(); 
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity onPress={() => openLink(url)} className='flex-row items-center space-x-2'>
             {hasIcon && <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="link-outline" size={18} color={theme.colors.primary} /> 
              </View>}
              <Text className={`text-base text-blue-500 ${textClass}`}>
                {t (text)}
              </Text>
    </TouchableOpacity>
  );
};

export default OpenLink;
