import { Colors } from '@/utils/colors';
import { formatPhone } from '@/utils/general';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, Linking, Alert, View, ActivityIndicator } from 'react-native';

const PhoneCall = ({ phoneNumber, loading = false }: { phoneNumber: string; loading?: boolean }) => {
  const handlePress = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number is missing!');
      return;
    }

    const url = `tel:${phoneNumber}`; // Qo'ng'iroq qilish uchun "tel:" protokoli

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url); // Telefon qo'ng'iroq interfeysini ochadi
      } else {
        Alert.alert('Error', 'Unable to make a call from this device.');
      }
    } catch (error) {
      console.error('Failed to make a call:', error);
      Alert.alert('Error', 'Something went wrong while trying to make a call.');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className='flex-row items-center space-x-2 '>
      <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
          {loading ? <ActivityIndicator size={18} color={Colors.light.tint} /> : <Ionicons name="call" size={18} color={Colors.light.tint} />} 
      </View>
      <Text className="text-base blue-500">
          {formatPhone(phoneNumber)}
      </Text>
    </TouchableOpacity>
  );
};

export default PhoneCall;