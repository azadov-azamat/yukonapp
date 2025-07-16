import { ContentSubscriptionLoader } from '@/components/content-loader';
import SubscriptionModel from '@/models/subscription';
import { formatPrice, getName, formatDate } from '@/utils/general';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface SubscriptionProps {
    subscription: SubscriptionModel;
}

const Subscriptions: React.FC<SubscriptionProps> = ({subscription}) => {
    const { t } = useTranslation();

    console.log(subscription);
    if (!subscription || !subscription.plan) {
        return <ContentSubscriptionLoader/>    
    }

    if (subscription.status === 'expired') {
        return (
            <View className="w-full max-w-md p-6 mb-4 border rounded-lg border-border-color">
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-xl font-bold text-gray-200 dark:text-border-color">{getName(subscription.plan, 'name')}</Text>
                    <View className="px-3 py-1 bg-red-100 rounded-full">
                        <Text className="text-sm font-medium text-red-600">{t('expired')}</Text>
                    </View>
                </View>
                
                <View className="p-4 bg-white border rounded-lg dark:bg-transparent border-border-color">
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="time-outline" size={24} color="#EF4444" />
                        <View>
                            <Text className="mb-1 text-sm text-gray-500 dark:text-border-color">{t('subscription_date')}</Text>
                            <Text className="text-gray-700 dark:text-border-color">
                                {subscription.startDate ? formatDate(new Date(subscription.startDate)) : ''} - {subscription.endDate ? formatDate(new Date(subscription.endDate)) : ''}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="w-full max-w-md p-6 mb-4 border rounded-lg shadow-sm border-border-color dark">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-primary-dark dark:text-border-color">{getName(subscription.plan, 'name')}</Text>
                <View className="px-3 py-1 bg-green-100 rounded-full">
                    <Text className="text-sm font-medium text-green-600">{t('active')}</Text>
                </View>
            </View>

            <View className="p-4 mb-6 rounded-lg bg-blue-50 dark:bg-border-color/20">
                <View className="flex-row items-start gap-3">
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    <Text className="flex-1 text-primary-dark dark:text-primary-light">{getName(subscription.plan, 'description')}</Text>
                </View>
            </View>
            
            <View className="p-4 border rounded-lg dark:bg-transparent border-border-color dark:bg-border-color/20">
                <View className="flex-row items-center gap-3">
                    <Ionicons name="calendar-outline" size={24} color="#6366F1" />
                    <View>
                        <Text className="mb-1 text-sm text-primary-dark dark:text-primary-light">{t('subscription_date')}</Text>
                        <Text className="text-primary-dark dark:text-primary-light">
                            {subscription.startDate ? formatDate(new Date(subscription.startDate)) : ''} - {subscription.endDate ? formatDate(new Date(subscription.endDate)) : ''}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Subscriptions;
