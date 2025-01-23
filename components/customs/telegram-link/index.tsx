import { Colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, Linking, Alert, View } from 'react-native';

const TelegramLink = ({ url }: { url: string }) => {
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
              <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="share-social" size={18} color={Colors.light.tint} /> 
              </View>
              <Text className="text-base blue-500">
                Telegram
              </Text>
    </TouchableOpacity>
  );
};

export default TelegramLink;
