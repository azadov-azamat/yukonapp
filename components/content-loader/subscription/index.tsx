import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";
import { useTheme } from "@/config/ThemeContext"; // Import useTheme

const CardLoader = () => {
  const { theme } = useTheme(); // Get theme from context

  return (
    <View className="p-3 mb-4 bg-white rounded-lg shadow-md">
      {/* Top Section */}
      <ContentLoader
        speed={1.5}
        width="100%"
        height={130}
        backgroundColor={theme.colors.background} // Use theme background color
        foregroundColor={theme.colors.border} // Use theme foreground color
      >
        {/* Tags */}
        <Rect x="10" y="10" rx="5" ry="5" width="20" height="20" />
        <Rect x="35" y="10" rx="5" ry="5" width="50" height="20" />
        <Rect x="220" y="10" rx="5" ry="5" width="80" height="20" />

        {/* Cities */}
        <Rect x="10" y="50" rx="5" ry="5" width="100" height="20" />
        <Rect x="200" y="50" rx="5" ry="5" width="100" height="20" />

        {/* Country */}
        <Rect x="10" y="75" rx="3" ry="3" width="80" height="15" />
        <Rect x="220" y="75" rx="3" ry="3" width="80" height="15" />

        {/* Icon Section */}
        <Rect x="10" y="110" rx="3" ry="3" width="96%" height="15" />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;