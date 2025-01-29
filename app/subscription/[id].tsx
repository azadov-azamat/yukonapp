import { CustomInput } from "@/components/customs";
// import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPlanById } from "@/redux/reducers/variable";
import { formatPrice, getName } from "@/utils/general";
import { useTranslation } from "react-i18next";
import PaymentForm from "@/components/forms/payment";

export default function Subscription() {
  const {id} = useLocalSearchParams(); 
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedPlan } = useAppSelector(state => state.variable);
  
  React.useEffect(() => {
    if (id) {
        dispatch(getPlanById(Number(id))).unwrap();
    }
  }, [id]);
  
  if  (!selectedPlan) {
    return <Text>Waiting...</Text>
  }
  return (
    <View className="items-center justify-center flex-1 p-4 bg-gray-100">
      {/* Header */}
        <View className="">
            <View>
                <Text className="mb-4 text-2xl font-bold text-gray-800">
                    {t ('payment-card.title')}
                </Text>
            </View>

            {/* Subscription Details */}
            <View className="w-auto p-4 mb-6 bg-blue-100 rounded-lg">
                <Text className="text-lg font-bold">{getName(selectedPlan, 'name')}</Text>
                <Text className="mt-2 text-sm text-gray-600">
                {getName(selectedPlan, 'description')}
                </Text>
                <View className="flex-row items-center flex-1 mt-2 space-x-2">
                <Text className="text-lg font-bold">
                {formatPrice(selectedPlan?.price || 0)} 
                </Text>
                <Text className="text-sm text-gray-600">
                {t ('for-' + selectedPlan?.duration_in_days)}
                </Text>
                </View>
            </View>

            {/* Form */}
            <PaymentForm/>
        </View>
    </View>
  );
}
