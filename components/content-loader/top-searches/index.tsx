import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const CardLoader = () => {
  return (
    <View className="border-t border-slate-300 p-4 bg-white">
      <ContentLoader
        speed={2}
        width="100%"
        height={57}
        backgroundColor="#E5E7EB" // skeletonBg
        foregroundColor="#D1D5DB" // skeletonFg
      >
        <Rect x="10" y="3" rx="5" ry="5" width="55" height="55" />

        {/* Birinchi qator (Toshkent → Samarqand) */}
        <Rect x="90" y="5" rx="5" ry="5" width="75" height="20" />
        <Rect x="175" y="5" rx="5" ry="5" width="20" height="20" />
        <Rect x="205" y="5" rx="5" ry="5" width="75" height="20" />

        {/* Ikkinchi qator (Umumiy ma'lumot) */}
        <Rect x="90" y="40" rx="5" ry="5" width="67%" height="15" />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;
