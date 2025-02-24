import { useTheme } from "@/config/ThemeContext";
import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const CardLoader = () => {
  const { theme } = useTheme();
  
  return (
    <View className="p-4 border-t bg-primary-light border-border-color dark:border-border-color/20 dark:bg-primary-dark/80">
      <ContentLoader
        speed={2}
        width="100%"
        height={57}
        backgroundColor={theme.colors.background} // Light mode skeletonBg
        foregroundColor={theme.colors.border} // Light mode skeletonFg
        className="dark:text-slate-500"
      >
        <Rect x="10" y="3" rx="5" ry="5" width="55" height="55" />

        {/* First Line (Toshkent → Samarqand) */}
        <Rect x="90" y="5" rx="5" ry="5" width="75" height="20" />
        <Rect x="175" y="5" rx="5" ry="5" width="20" height="20" />
        <Rect x="205" y="5" rx="5" ry="5" width="75" height="20" />

        {/* Second Line (Umumiy ma'lumot) */}
        <Rect x="90" y="40" rx="5" ry="5" width="67%" height="15" />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;
