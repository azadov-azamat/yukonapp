import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, ScrollView, Animated, PanResponder, FlatList, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/config/ThemeContext"; // ✅ Import the Theme Context
import React from "react";
import { useBottomSheet } from "@/hooks/context/bottom-sheet";
import { getSubscriptions } from "@/redux/reducers/variable";
import { EmptyStateCard, SubscriptionCard } from "@/components/cards";
import { useColorScheme } from "nativewind";
import { Text } from "react-native";

export default function ProfilePage() {
  const router = useRouter();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth)
  const { openSettings } = useBottomSheet();
  const { subscriptions } = useAppSelector(state => state.variable);
  const { colorScheme } = useColorScheme();
  const { theme } = useTheme();

  const insets = useSafeAreaInsets();

  const panY = React.useRef(new Animated.Value(0)).current;
  const isExpanded = React.useRef(false);
  const scrollViewRef = React.useRef(null);
  const scrollOffset = React.useRef(0);

  const translateY = panY.interpolate({
    inputRange: [-220, 0],
    outputRange: ['20%', '50%'],
    extrapolate: 'clamp',
  });

  const cardOpacity = panY.interpolate({
    inputRange: [-200, -100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const profileOpacity = panY.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleTriggerGesture = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isVerticalDrag = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        return isVerticalDrag && Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isExpanded.current) {
          // Faqat scroll 0 pozitsiyada bo'lganda pastga tortishga ruxsat berish
          if (gestureState.dy > 0 && scrollOffset.current <= 0) {
            panY.setValue(gestureState.dy);
          }
        } else {
          // Expanded bo'lmaganda faqat yuqoriga tortishga ruxsat berish
          if (gestureState.dy < 0) {
            panY.setValue(gestureState.dy);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50 && !isExpanded.current) {
          // Yuqoriga tortilganda
          Animated.spring(panY, {
            toValue: -200,
            useNativeDriver: false,
            bounciness: 4
          }).start(() => {
            isExpanded.current = true;
            if (scrollViewRef.current) {
              (scrollViewRef.current as any).setNativeProps({ scrollEnabled: true });
            }
          });
        } else if (gestureState.dy > 50 && isExpanded.current && scrollOffset.current <= 0) {
          // Pastga tortilganda va scroll tepada bo'lganda
          if (scrollViewRef.current) {
            (scrollViewRef.current as any).setNativeProps({ scrollEnabled: false });
          }
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 4
          }).start(() => {
            isExpanded.current = false;
          });
        } else {
          // Yetarli masofaga tortilmagan bo'lsa
          Animated.spring(panY, {
            toValue: isExpanded.current ? -200 : 0,
            useNativeDriver: false,
            bounciness: 4
          }).start();
        }
      },
    })
  ).current;

  const handleScroll = (event: any) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  const logoutFunction = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    router.replace('/auth');
  }

  const collapseBottomSheet = () => {
    if (isExpanded.current) {
      if (scrollViewRef.current) {
        (scrollViewRef.current as any).setNativeProps({ scrollEnabled: false });
      }
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: false,
        bounciness: 4
      }).start(() => {
        isExpanded.current = false;
      });
    }
  };

  React.useEffect(() => {
    dispatch(getSubscriptions({ status: 'active' }));
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}}>
        <View className="relative flex-1 bg-primary">
          {/* Initial Profile View */}
          <Animated.View
            style={{ opacity: profileOpacity }}
            className="absolute top-0 left-0 right-0 z-10"
          >
            <TouchableOpacity
              className="flex-1"
              activeOpacity={0.9}
              onPress={collapseBottomSheet}
            >
              <View className="flex-row items-center justify-between px-4 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={28} color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openSettings}>
                  <Ionicons name="settings-outline" size={24} color={"white"} />
                </TouchableOpacity>
              </View>

              <View className="items-center px-4 mt-4">
                <View className="items-center justify-center w-32 h-32 overflow-hidden border-4 border-white/20 rounded-full bg-[#7857FF]">
                  <Ionicons name="person" size={64} color="white" />
                </View>
                <Text className="mt-4 text-2xl font-bold text-white">{user?.fullName}</Text>
                <Text className="text-lg text-white/70">+{user?.phone}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Compact Card View */}
          <Animated.View
            style={{ opacity: cardOpacity }}
            className="absolute top-0 left-0 right-0 z-20"
          >
            <TouchableOpacity
              className="flex-1"
              activeOpacity={0.9}
              onPress={collapseBottomSheet}
            >
              <View className="flex-row items-center justify-between px-4 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openSettings}>
                  <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className="mx-4 overflow-hidden border border-white/10 rounded-2xl bg-white/5 backdrop-blur-lg">
                <View className="flex-row items-center p-4">
                  <View className="items-center justify-center w-12 h-12 overflow-hidden rounded-xl bg-[#7857FF]">
                    <Ionicons name="person" size={24} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-white">{user?.fullName}</Text>
                    <Text className="text-sm text-white/70">+{user?.phone}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Sheet */}
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: translateY,
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark : theme.colors.light,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
            }}
          >
            {/* Trigger handle */}
            <View
              {...handleTriggerGesture.panHandlers}
              className="w-full px-4 py-3"
            >
              <View className="w-12 h-1 mx-auto rounded-full bg-gray-400/30" />
            </View>

            <FlatList
              ref={scrollViewRef}
              className="flex-1 px-4"
              data={subscriptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <SubscriptionCard subscription={item} />}
              ListEmptyComponent={
                <View className="flex-col ">
                <EmptyStateCard type="subscription-active" />
                <MenuItem
                  title="profile.subscriptions"
                  icon="cart-outline"
                  onPress={() => router.replace('/profile/subscriptions')}
                />
              </View>
              }
              scrollEnabled={isExpanded.current}
              bounces={false}
              showsVerticalScrollIndicator={true}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </Animated.View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
interface MenuItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}
const MenuItem = ({ title, icon, onPress }: MenuItemProps) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full p-4 mt-2 border rounded-lg border-border-color/20 bg-primary-light dark:bg-primary-dark/20`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Ionicons
            name={(isDarkMode ? icon.replace('-outline', '') : icon) as keyof typeof Ionicons.glyphMap}
            size={24} color={theme.colors.primary} />
          </View>
          <Text className={`text-lg font-medium text-primary-title-color dark:text-primary-light`}>{t(title)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
};
