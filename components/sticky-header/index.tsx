import React, { use, useCallback, useMemo } from "react";
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
import { useTranslation } from "react-i18next";

interface StickyHeaderProps {
  scrollY: Animated.Value;
}

const HEADER_HEIGHT = 65;
const SCROLL_THRESHOLD = 30;

const StickyHeader: React.FC<StickyHeaderProps> = ({ scrollY }) => {
  const {t} = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { openEditForm } = useBottomSheet();

  const backgroundColor = useMemo(() => scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["transparent", "#ffffff"],
    extrapolate: "clamp",
  }), [scrollY]);

  const iconColor = useMemo(() => scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["#ffffff", "#623bff"],
    extrapolate: "clamp",
  }), [scrollY]);

  const textColor = useMemo(() =>
    scrollY.interpolate({
      inputRange: [0, SCROLL_THRESHOLD],
      outputRange: ["#ffffff", "#000000"],
      extrapolate: "clamp",
    }),
  [scrollY]);


  const handleIconPress = useCallback(() => {
    if (Platform.OS === 'android') {
      router.push('/android/ads/create');
    } else {
      openEditForm(0, 'load');
    }
  }, [router, openEditForm]);

  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0)?.toUpperCase() || '';
    const last = user?.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  }, [user]);

  return (
    <Animated.View style={[styles.header, { backgroundColor }]} className="px-4">
      <View className="flex-row items-center space-x-4">
        <View className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-primary ring-4 ring-purple-500/30">
          <Text className="text-lg font-semibold text-white">{initials}</Text>
        </View>
        <View>
          <Animated.Text
            style={{ color: textColor }}
            className="text-sm"
            >
            {t('good-morning')}
            </Animated.Text>

            <Animated.Text
            style={{ color: textColor }}
            className="text-base font-bold"
            >
            {user?.fullName}
          </Animated.Text>

        </View>
      </View>

      <View className="flex-row items-center space-x-2">
        <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.iconButton}>
          <Animated.Text style={{ color: iconColor }}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={undefined}  />
          </Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleIconPress} style={styles.iconButton}>
          <Animated.Text style={{ color: iconColor }} >
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color={undefined} />
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "transparent",
  },
  iconButton: {
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
});

export default React.memo(StickyHeader);
