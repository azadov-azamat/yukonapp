import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

const CardLoaderLoadComponent = () => {
  return (
    <View style={styles.card}>
      {/* Top Section */}
      <ContentLoader
        speed={1.5}
        width="100%"
        height={130}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        {/* Tags */}
        <Rect x="10" y="10" rx="5" ry="5" width="80" height="20" />
        <Rect x="100" y="10" rx="5" ry="5" width="50" height="20" />
        <Rect x="160" y="10" rx="5" ry="5" width="80" height="20" />

        {/* Cities */}
        <Rect x="10" y="50" rx="5" ry="5" width="100" height="20" />
        <Rect x="200" y="50" rx="5" ry="5" width="100" height="20" />

        {/* Country */}
        <Rect x="10" y="80" rx="3" ry="3" width="90" height="15" />
        <Rect x="200" y="80" rx="3" ry="3" width="90" height="15" />

        {/* Icon Section */}
        <Rect x="10" y="110" rx="3" ry="3" width="150" height="15" />
        <Rect x="200" y="110" rx="8" ry="8" width="30" height="15" />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5, // Android uchun
  },
});

export default CardLoaderLoadComponent;
