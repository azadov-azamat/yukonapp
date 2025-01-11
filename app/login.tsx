import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import LoginForm from '@/components/forms/login';

export default function LoginScreen() {

  return (
    <View className='flex-1 bg-gray-100 justify-center items-center'>
      {/* Logo */}
      {/* <Image
        source={{ uri: 'https://example.com/logo.png' }} // O'zingizning logotipingizni joylashtiring
        style={tailwind('w-20 h-20 mb-6')}
      /> */}
      {/* Form */}
      <LoginForm/>
    </View>
  );
}
