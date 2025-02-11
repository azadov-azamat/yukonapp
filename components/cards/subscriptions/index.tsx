import { ContentSubscriptionLoader } from '@/components/content-loader';
import SubscriptionModel from '@/models/subscription';
import { formatPrice, getName } from '@/utils/general';
import React from 'react';
import { View, Text } from 'react-native';

const Subscriptions: React.FC<{subscription: SubscriptionModel}> = ({subscription}) => {
    if (!subscription || !subscription.plan) {
        return <ContentSubscriptionLoader/>    
    }

    return (
        <View className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Text className="text-2xl font-bold text-[#00235B] mb-4">{getName(subscription.plan, 'name')}</Text>
  
        <View className="flex items-start gap-2 mb-6">
          <Text className="text-lg text-gray-700">{getName(subscription.plan, 'description')}</Text>
        </View>
  
        <View className="text-[#00235B] text-4xl font-bold mb-8">
          {formatPrice(subscription.plan?.price)}
          {/* {subscription..toLocaleString()} */}
        </View>
  
        <View className="p-4 border rounded-lg bg-gray-50">
          <View className="flex items-center justify-center gap-2 text-center">
            {/* Calendar SVG */}
           
            <Text className="font-medium text-gray-700">Obuna davomiyligi</Text>
          </View>
          <Text className="mt-2 text-center text-gray-600">
            {/* {form(startDate)} - {formatDate(endDate)} */}
          </Text>
        </View>
      </View>
    );
};

export default Subscriptions;
