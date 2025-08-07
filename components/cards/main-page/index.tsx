import SubscriptionModel from "@/models/subscription";
import { getSubscriptionStatus } from "@/utils/general";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

const CardButton = React.memo(({ iconName, title, subtitle, onPress, disabled }: {
    iconName: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress?: () => void,
    disabled?: boolean
  }) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className="relative flex flex-col items-center w-full py-4 space-y-4 text-white bg-primary rounded-2xl"
    >
      <View className="flex flex-row items-center w-full gap-4 px-3">
				<View className="flex items-center justify-center border border-white shadow-lg h-9 w-9 bg-primary rounded-xl ">
					<Ionicons name={iconName} size={18} color="#FFF" />
				</View>
				<View className="flex items-center flex-auto">
        	<Text className="capitalize block text-base font-bold text-white leading-[21px] tracking-wider">{title}</Text>
        	{/* <Text className="text-xs text-white opacity-80">{subtitle}</Text> */}
				</View>
      </View>

    </TouchableOpacity>
));

// React.memo(CardButton)

const StatsCard = React.memo(({
      title,
      count,
      icon,
      delta,
      deltaText,
    }: {
      title: string;
      count: number;
      icon: keyof typeof Ionicons.glyphMap;
      delta: string;
      deltaText: string;
    }) => {
      const isNegative = delta.startsWith("-"); // ✅ delta musbatmi yoki manfiy

      const deltaColor = isNegative ? "text-red-600" : "text-green-600";
      const deltaIconColor = isNegative ? "#dc2626" : "#16a34a"; // icon uchun HEX

      return (
            <View className="flex-col p-4 bg-white shadow-md rounded-2xl dark:bg-primary-dark">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-500">{title}</Text>
                  <Text className="mt-1 text-3xl font-bold text-primary">{count}</Text>
                </View>
                <View className="items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
                  <Ionicons name={icon} size={20} color="#8b5cf6" />
                </View>
              </View>
              <View className="flex-row items-center mt-2 space-x-1">
                <Ionicons
                  name={isNegative ? "arrow-down" : "arrow-up"}
                  size={12}
                  color={deltaIconColor}
                />
                <Text className={`text-xs font-medium ${deltaColor}`}>
                  {delta}
                </Text>
              </View>
							<Text className={`text-xs font-medium ${deltaColor}`}>
                {deltaText}
              </Text>
            </View>
      );
    });

React.memo(StatsCard)

const TotalStatsCard = React.memo(({ icon, count, label, growth }: {
      icon: keyof typeof Ionicons.glyphMap;
      count: number;
      label: string;
      growth: string;
    }) => {
      return (
        <View className="items-center flex-1 space-y-2">
          <View className="items-center justify-center w-12 h-12 shadow bg-primary rounded-2xl">
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">{count.toLocaleString()}</Text>
          <Text className="text-sm text-gray-500">{label}</Text>
          {/* <View className="px-3 py-1 bg-green-100 rounded-full">
            <Text className="text-xs font-medium text-green-700">↑ {growth} this week</Text>
          </View> */}
        </View>
      );
});
React.memo(TotalStatsCard)

const SubscriptionStatusCard: React.FC<{ planName?: string; subscription: SubscriptionModel | null;}> = ({ planName = "Premium Plan", subscription }) => {
  const { status, bgColor, textColor, borderColor } = getSubscriptionStatus(subscription?.endDate || '');

  const isExpired = status === "expired" || status === "critical";

  return (
    <View className={`mt-6 rounded-2xl p-4 space-y-4 ${bgColor} border border-x-orange-200 border-y-orange-200 ${borderColor}`}>
      <View className="flex-row items-center justify-between">
        {/* Plan Info */}
        <View className="flex-row items-center space-x-4">
          <View className={`p-3 rounded-xl ${bgColor}`}>
            <MaterialCommunityIcons name="calendar-month" size={24} color="#dc2626" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">{planName}</Text>
            <Text className="text-sm text-gray-500">Active subscription</Text>
          </View>
        </View>

        {/* Status */}
        <View className="flex-row items-center px-3 py-1 bg-red-100 rounded-full">
          <Ionicons name="time-outline" size={16} color="#dc2626" />
          <Text className={`ml-1 text-xs font-semibold capitalize text-orange-700`}>{status}</Text>
        </View>
      </View>

      {/* Expiry Date */}
      <Text className="text-sm text-gray-500">Expires: {subscription?.endDate}</Text>

      {/* Alert Message */}
      {isExpired && (
        <View className="flex-row items-start p-3 space-x-2 bg-red-100 rounded-xl">
          <Ionicons name="close-circle-outline" size={20} color="#dc2626" />
          <Text className="text-sm font-medium text-red-700">
            Your subscription has expired. Renew now to restore access to premium features.
          </Text>
        </View>
      )}
    </View>
  );
};

React.memo(SubscriptionStatusCard)

export default {TotalStatsCard, StatsCard, CardButton, SubscriptionStatusCard};
