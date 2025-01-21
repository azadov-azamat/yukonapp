import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const CardLoader = () => {
  return (
    <View className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <ContentLoader
        speed={2}
        width="100%"
        height={80}
        backgroundColor="#E5E7EB" // skeletonBg
        foregroundColor="#D1D5DB" // skeletonFg
      >
        {/* Birinchi qator (Toshkent → Samarqand) */}
        <Rect x="10" y="20" rx="5" ry="5" width="80" height="15" />
        <Rect x="140" y="20" rx="5" ry="5" width="30" height="15" />
        <Rect x="210" y="20" rx="5" ry="5" width="80" height="15" />

        {/* Ikkinchi qator (Umumiy ma'lumot) */}
        <Rect x="10" y="65" rx="5" ry="5" width="96%" height="12" />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;
