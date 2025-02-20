import { View, Alert, TouchableOpacity } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import { CustomLanguageSelector } from "@/components/custom";
import SettingsBottomSheet, { SettingsBottomSheetRef } from "@/components/bottom-sheet/settings";
export default function MainPage() {
  const settingsSheetRef = React.useRef<SettingsBottomSheetRef>(null);

  const openSettings = () => {
    settingsSheetRef.current?.open();
  };

  return (
    <>
      <View className="absolute top-0 left-0 right-0 flex-row items-center justify-end h-screen py-3">
        {/* Language Selector */}
        {/* <CustomLanguageSelector /> . */}
      </View>
      {/* <View className="absolute top-0 left-0 right-0 flex-row items-center justify-start py-3"> */}
        <TouchableOpacity className="px-4 py-2 rounded-md bg-primary" onPress={openSettings}>Press</TouchableOpacity>
      {/* </View> */}
      <SettingsBottomSheet ref={settingsSheetRef} />
      <LoginForm />
    </>
  );
}
