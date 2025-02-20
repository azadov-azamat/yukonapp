import React, { useRef, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/config/ThemeContext";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Icon, MD3Colors } from 'react-native-paper';
import { CustomIconButton } from "@/components/custom";

interface StickyHeaderProps {
  title?: string;
}

const HEADER_HEIGHT = 50;

const StickyHeader: React.FC<StickyHeaderProps> = ({
  style,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { backgroundColor: 'transparent', marginTop: insets.top }]}>
      <View style={styles.leftIcons}>
        <CustomIconButton
          icon="menu"
          onPress={() => console.log("Icon clicked")}
        />
      </View>

      <View style={styles.leftIcons}>
        <CustomIconButton
          icon="bell"
          onPress={() => console.log("Icon clicked")}
        />
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  leftIcons: {
    flexDirection: "column",
    gap: 10,
  },
  rightIcons: {
    flexDirection: "column",
    gap: 10,
  },
});

export default StickyHeader;
