import React, { useRef, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/config/ThemeContext";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface StickyHeaderProps {
  title?: string;
}

const HEADER_HEIGHT = 50;

const StickyHeader: React.FC<StickyHeaderProps> = ({
  title = "Sticky Header",
  style,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { backgroundColor: 'transparent', marginTop: insets.top }]}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // ✅ Ensure header is above content
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default StickyHeader;
