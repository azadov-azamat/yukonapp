import React from "react";
import {
  View,
  Text,
  StyleSheet,
	Animated,
	TouchableOpacity,
  Platform,
} from "react-native";
import { useBottomSheet } from '@/hooks/context/bottom-sheet';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hooks";

interface StickyHeaderProps {
  title?: string;
  scrollY: Animated.Value;
}

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

const StickyHeader: React.FC<StickyHeaderProps> = ({ scrollY }) => {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth)
	const { openEditForm } = useBottomSheet();

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

  const handleIconPress = () => {
    if (Platform.OS === 'android') {
      router.push('/android/ads/create');
    } else {
      openEditForm(0, 'load');
    }
  };
  
  return (
    <Animated.View
      style={[styles.header, { backgroundColor }]}
      className="px-4"
    >
      <View className="flex-row items-center space-x-4">
        <View className="flex items-center justify-center w-12 h-12 bg-purple-700 rounded-full shadow-lg ring-4 ring-purple-500/30">
          <Text className="text-white">{user?.firstName.substring(0, 1)}{user?.lastName ? user?.lastName.substring(0, 1) : ''}</Text>
        </View>
        <View>
              <Text className="text-sm text-white opacity-90">Good morning</Text>
              <Text className="text-base font-bold text-white">{user?.fullName}</Text>
        </View>
				{/* <TouchableOpacity onPress={() => console.log("Icon clicked")} style={[styles.iconButton]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="menu" size={24} />
					</Animated.Text>
				</TouchableOpacity> */}
      </View>

      <View className="flex-row items-center space-x-2">
        <TouchableOpacity onPress={() => router.push("/notifications")} style={[styles.iconButton]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="bell-outline" size={24} />
					</Animated.Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleIconPress} style={[styles.iconButton]}>
					<Animated.Text style={{ color: iconColor }}>
						<MaterialCommunityIcons name="plus-circle-outline" size={24} />
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
    top: 8,
    left: 0,
    right: 0,
    zIndex: 20, // ✅ Ensure header is above content
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "transparent",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
  },
  leftIcons: {
    flexDirection: "column",
    gap: 10,
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
