import { ContentSubscriptionLoader } from '@/components/content-loader';
import { formatPrice, getName } from '@/utils/general';
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import PlanModel from '@/models/plan';
import { CustomButton } from '@/components/custom';
import { useRouter } from 'expo-router';

const Plan: React.FC<PlanModel> = (plan) => {
    const { t } = useTranslation();
    const router = useRouter();
    
    if (!plan) {
        return <ContentSubscriptionLoader/>    
    }

    const handleSubscribe = (id: number) => router.push(`/profile/payment/${id}`)

    return (
        <View
            className={`p-4 bg-primary-light/20 dark:bg-primary-dark border rounded-lg border-border-color/20`}
        >
        <Text className="text-lg font-semibold text-primary-title-color dark:text-primary-light">{getName(plan, 'name')}</Text>
        <Text className="mt-2 text-sm text-primary-desc-color dark:text-primary-light">{getName(plan, 'description')}</Text>
        <View className='flex-row items-center justify-between mt-4'>
            <Text className="text-xl font-bold text-primary-title-color dark:text-primary-light">{formatPrice(plan.price)}</Text>
            <CustomButton
                title={t ('subscribe')}
                onPress={() => handleSubscribe(plan.id)}
                buttonStyle="py-1 px-3 bg-primary"
                textStyle='text-base'
            />                
        </View>
    </View>
    );
};

export default Plan;
