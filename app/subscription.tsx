import { CustomInput } from "@/components/customs";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Subscription() {
  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Header */}
      <Text className="mb-4 text-2xl font-bold text-center text-gray-800">
        To'lov shakli
      </Text>

      {/* Subscription Details */}
      <View className="p-4 mb-6 bg-blue-100 rounded-lg">
        
        <Text className="text-lg font-bold text-gray-800">3 kunlik obuna</Text>
        <Text className="mt-2 text-sm text-gray-600">
          15 ming so'm to'lov orqali 3 kun mobaynida botdan cheksiz
          foydalanishingiz mumkin
        </Text>
        <Text className="mt-2 text-lg font-bold text-blue-800">
          15000 3 kun uchun
        </Text>
      </View>

      {/* Form */}
      <View className="mb-6 space-y-4">
        {/* Card Number */}
        <View>
          <Text className="text-sm font-medium text-gray-700">
            Karta raqami*
          </Text>
          <TextInput
            className="p-3 mt-2 bg-white border border-gray-300 rounded-lg"
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
          />
        </View>

        {/* Expiry Date */}
        <View>
          <Text className="text-sm font-medium text-gray-700">Muddati*</Text>
          <TextInput
            className="p-3 mt-2 bg-white border border-gray-300 rounded-lg"
            placeholder="OY/YIL"
            keyboardType="numeric"
          />
        </View>

        {/* Info */}
        <Text className="text-xs text-gray-500">
          🔒 Sizning kartangiz ma'lumotlari ushbu xizmatga uzatilmaydi va Payme
          xizmatining xavfsiz hududida saqlanadi
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity className="py-3 bg-blue-600 rounded-lg">
        <Text className="text-base font-bold text-center text-white">
          Davom etish
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text className="mt-4 text-xs text-center text-gray-500">
        "Davom etish" tugmasini bosish orqali siz{" "}
        <Text className="text-blue-600 underline">oferta shartlariga</Text>{" "}
        qo'shilasiz
      </Text>
    </View>
  );
}
