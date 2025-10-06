import React from 'react';
import { View, Text, Image } from 'react-native';
import * as Application from 'expo-application';

export default function BootScreen() {
  const version = Application.nativeApplicationVersion ?? '0.0.0';
  const build   = Application.nativeBuildVersion ?? '-';

  return (
    <View className="items-center justify-center flex-1 px-6 bg-white">
      {/* Logo */}
      <Image
        source={require('../../assets/images/splash-icon.png')}
        className="mb-6 w-52 h-52"
        resizeMode="contain"
      />
      {/* App nomi */}
      <Text className="mb-2 text-2xl font-semibold text-primary">
        Yukon uz
      </Text>

      {/* Pastki burchakda versiya */}
      <View className="absolute left-0 right-0 items-center bottom-6">
        <Text className="text-xs text-slate-400">
          v{version} ({build})
        </Text>
      </View>
    </View>
  );
}
