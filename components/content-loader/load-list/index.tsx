import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";
import { useTheme } from "@/config/ThemeContext";

const CardLoader = () => {
  const { theme } = useTheme();

  return (
    <View className="p-3 mb-4 bg-white rounded-lg shadow-md">
      {/* Top Section */}
      <ContentLoader
        speed={1.5}
        width="100%"
        height={40}
        backgroundColor={theme.colors.background}
        foregroundColor={theme.colors.border}
      >
        {/* Cities */}
        <Rect x="5" y="0" rx="5" ry="5" width="80" height="18" />
        <Rect x="90" y="0" rx="5" ry="5" width="80" height="18" />

        {/* Country */}
        <Rect x="5" y="30" rx="3" ry="3" width="40" height="10" />
        <Rect x="50" y="30" rx="3" ry="3" width="50" height="10" />

        {/* Icon Section */}
        <Rect x="220" y="30" rx="3" ry="3" width="85" height="10" />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;
