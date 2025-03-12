import { View } from "react-native";
import React from "react";
import { CustomButton, CustomLanguageSelector } from "@/components/custom";
import { useRouter } from "expo-router";
import RegisterForm from "@/components/forms/register";
import { useTranslation } from "react-i18next";

export default function SignupScreen() {
  const router = useRouter();
  const {t} = useTranslation(); 
  
  return (
    <>
      <View className="absolute left-0 right-0 flex-row items-center justify-end h-screen py-3 top-5">
        {/* Language Selector */}
        <CustomLanguageSelector /> .
      </View>
      {/* <View className="absolute top-0 left-0 right-0 flex-row items-center justify-start py-3"> */}
        
      {/* </View> */}
      
      <RegisterForm />
      <CustomButton title={t('login')} onPress={() => router.push('/auth')} />
    </>
  );
}
