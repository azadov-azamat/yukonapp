import React, { useRef, ReactNode } from "react";
import {
  View,
  StyleSheet,
	Animated,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "@/config/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { CustomIconButton } from "@/components/custom";
import { useBottomSheet } from '@/hooks/context/bottom-sheet';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomIconButton from "../custom/icon-button";

interface StickyHeaderProps {
  title?: string;
  scrollY: Animated.Value;
}

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

const StickyHeader: React.FC<StickyHeaderProps> = ({ scrollY }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

	const { openEditLoad } = useBottomSheet();

	const backgroundColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["transparent", "#ffffff"], // Transparent → White
    extrapolate: "clamp",
  });

  // Icon color transition
  const iconColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["#ffffff", "#623bff"], // White → Black
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.header, { backgroundColor }]}
      className="px-4"
    >
      <View style={styles.leftIcons}>
				<TouchableOpacity onPress={() => console.log("Icon clicked")} style={[styles.iconButton]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="menu" size={24} />
					</Animated.Text>
				</TouchableOpacity>
      </View>

      <View style={styles.rightIcons}>
				<TouchableOpacity onPress={() => openEditLoad(0)} style={[styles.iconButton, {marginRight: 14}]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="plus-circle-outline" size={24} />
					</Animated.Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => console.log("Icon clicked")} style={[styles.iconButton]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="bell" size={24} />
					</Animated.Text>
				</TouchableOpacity>
      </View>
    </Animated.View>
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
    zIndex: 20, // ✅ Ensure header is above content
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
    flexDirection: "row",
    gap: 2,
  },
	iconButton: {
    borderRadius: 50, // Circular shape
    backgroundColor: 'transparent', // No background by default
    elevation: 0, // ✅ No shadow for Android
    shadowColor: 'transparent', // ✅ No shadow for iOS
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default StickyHeader;
