import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPlanById } from "@/redux/reducers/variable";
import { formatPrice, getName } from "@/utils/general";
import { useTranslation } from "react-i18next";
import PaymentForm from "@/components/forms/payment";
import { ContentPaymentPageLoader } from "@/components/content-loader";
import ConfirmCodeForm from "@/components/forms/confirm-code";
import { resetState } from "@/redux/reducers/card";

export default function Payment() {
    const {id} = useLocalSearchParams(); 
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { selectedPlan } = useAppSelector(state => state.variable);
    const { verifyData, card } = useAppSelector(state => state.card);
    
    React.useEffect(() => {
        if (id) {
            dispatch(getPlanById(Number(id))).unwrap();
        }
    }, [id]);
    
    React.useEffect(() => {
        return ()=> {
            dispatch(resetState());
        }
    }, []);
    
    if  (!selectedPlan) {
        return <ContentPaymentPageLoader/>
    }
      
    return (
        <View className="relative items-center justify-center flex-1 p-4 bg-[#f3f4f6]">
        {/* Header */}
            <View className="w-full">
        
                {/* Subscription Details */}
                <View className="w-auto h-40 p-4 mb-6 bg-blue-100 rounded-lg">
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
                {!verifyData || !card ? <PaymentForm/> : <ConfirmCodeForm/>}
            </View>
        </View>
    );
}
