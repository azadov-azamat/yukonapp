import { Button, View, Text } from "react-native";
import React from "react";
import { CustomButton, CustomHeader, CustomLanguageSelector } from "@/components/custom";
import { RelativePathString, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "@/components/forms/forgot-password";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const {t} = useTranslation(); 
  
  return (
    <>
      <View className="absolute left-0 right-0 flex-row items-start justify-between h-screen py-3 top-5">
        <View className="ml-2"> 
            <Ionicons
              name="chevron-back"
              size={28}
              onPress={() => router.replace("/auth")} 
            />
        </View>
        {/* Language Selector */}
        <CustomLanguageSelector /> .
      </View>
      <View className="px-4 text-center">
        <Text className="mb-5 text-2xl font-bold text-center">{t('forgot-password')}</Text>
        <Text className="mb-5 text-sm text-center">{t('forgot-password-description')}</Text>
      </View>
      
      <ForgotPasswordForm />
      {/* <CustomButton title={t('login')} onPress={() => router.push('/auth')} /> */}
    </>
  );
}
