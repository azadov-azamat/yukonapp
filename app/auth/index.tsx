import { View, Alert } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import { CustomLanguageSelector } from "@/components/custom";

export default function MainPage() {
  return (
    <>
      <View className="absolute top-0 left-0 right-0 flex-row items-center justify-end px-4 py-3">
        {/* Language Selector */}
        <CustomLanguageSelector />
      </View>
      <LoginForm />
    </>
  );
}
