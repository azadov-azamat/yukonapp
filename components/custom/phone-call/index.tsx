import { useTheme } from '@/config/ThemeContext';
import { formatPhone, openLink } from '@/utils/general';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

const PhoneCall = ({ phoneNumber, loading = false }: { phoneNumber: string; loading?: boolean }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={() => openLink(`tel:${phoneNumber}`)} className='flex-row items-center space-x-2 '>
      <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
          {loading ? <ActivityIndicator size={18} color={theme.colors.primary} /> : <Ionicons name="call-outline" size={18} color={theme.colors.primary} />} 
      </View>
      <Text className="text-base blue-500">
          {formatPhone(phoneNumber)}
      </Text>
    </TouchableOpacity>
  );
};

export default PhoneCall;