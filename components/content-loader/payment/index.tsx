import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';
import { useTheme } from "@/config/ThemeContext";

const PaymentContentLoader = () => {
  const { theme } = useTheme();

  return (
    <View className="justify-center flex-1 p-5 bg-white">
      <ContentLoader 
        speed={2}
        width="100%"
        height={300}
        backgroundColor={theme.colors.background}
        foregroundColor={theme.colors.border}
      >
        {/* Title */}
        <Rect x="20" y="20" rx="4" ry="4" width="200" height="20" />
        {/* Payme logo */}
        <Rect x="280" y="20" rx="4" ry="4" width="80" height="20" />
        
        {/* Card - Subscription Info */}
        <Rect x="20" y="60" rx="10" ry="10" width="340" height="80" />
        
        {/* Card Number Field */}
        <Rect x="20" y="160" rx="4" ry="4" width="300" height="40" />
        {/* Expiry Date Field */}
        <Rect x="20" y="220" rx="4" ry="4" width="150" height="40" />
        
        {/* Button */}
        <Rect x="20" y="280" rx="4" ry="4" width="200" height="50" />
      </ContentLoader>
    </View>
  );
};

export default PaymentContentLoader;
