import { TouchableOpacity, View, Alert } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUserMe } from "@/redux/reducers/auth";
import { useRouter } from "expo-router";
import { CustomLanguageSelector } from "@/components/custom";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";

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
