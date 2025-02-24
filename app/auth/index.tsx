import { View, Alert, TouchableOpacity } from "react-native";
import LoginForm from '@/components/forms/login';
import React from "react";
import { CustomLanguageSelector } from "@/components/custom";
export default function MainPage() {
  
  return (
    <>
      <View className="absolute top-0 left-0 right-0 flex-row items-center justify-end h-screen py-3">
        {/* Language Selector */}
        <CustomLanguageSelector /> .
      </View>
      {/* <View className="absolute top-0 left-0 right-0 flex-row items-center justify-start py-3"> */}
        
      {/* </View> */}
      
      <LoginForm />
    </>
  );
}
