import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, RefreshControl, Animated, StatusBar } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { getTopSearches, fetchLatestLoads, getLoadStats } from "@/redux/reducers/load";
import { useRouter } from "expo-router";
import { requestLocationPermission } from "@/utils/general";
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { LoadModal } from '@/components/modal'
import { MainPageCards } from "@/components/cards";
import { getVehicleStats } from "@/redux/reducers/vehicle";

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const { dashboardStats: loadStats } = useAppSelector(state => state.load);
  const { dashboardStats: vehicleStats } = useAppSelector(state => state.vehicle);
  
  const [openModal, setOpenModal] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

	const scrollY = React.useRef(new Animated.Value(0)).current;
	const statusBarBackgroundColor = useMemo(() =>
		scrollY.interpolate({
			inputRange: [15, SCROLL_THRESHOLD],
			outputRange: ["#623bff", "#FFFFFF"],
			extrapolate: "clamp",
		}),
	[scrollY]);

	const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    requestLocationPermission(dispatch);
  }, []);

  // Combined focus effect for data fetching and cleanup
  React.useEffect(() => {
    const abortController = new AbortController();
    let isSubscribed = true;

    const fetchData = async () => {
      if (!isSubscribed) return;
      try {
        await Promise.all([
          dispatch(getTopSearches()),
          dispatch(fetchLatestLoads())
        ]);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
      abortController.abort();
      StatusBar.setBackgroundColor("transparent");
    };
  }, []);

  React.useEffect(() => {
    dispatch(getLoadStats());
    dispatch(getVehicleStats());
  }, []);
  
  const toggleModal = useCallback(() => {
    setOpenModal(prev => !prev);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(getTopSearches()),
      dispatch(fetchLatestLoads())
    ]);
    setRefreshing(false);
  }, [dispatch]);

  // Cleanup for animated value
  React.useEffect(() => {
    return () => {
      scrollY.removeAllListeners();
    };
  }, [scrollY]);
    
  return (
    <View style={{ flex: 1 }}>      
      <Animated.View style={{ backgroundColor: statusBarBackgroundColor, height: insets.top, padding: 0, margin: 0 }}>
        <StatusBar
          translucent
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={'transparent'}
        />
      </Animated.View>

      <LinearGradient
        colors={['#623bff', '#CCADFF', '#FFFFFF']}
        locations={[0, 0.5, 1]}  // 50% gradient, 50% white
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}   // Start from the top
        end={{ x: 0, y: 1 }}     // End at the bottom
      >
        <StickyHeader scrollY={scrollY} />
        <View className="z-10 flex-1 mt-5 overflow-visible">
          <Animated.ScrollView
            className="flex-1"
            style={{ paddingTop: HEADER_HEIGHT }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFF" // iOS spinner color
                colors={["#FFF"]} // Android spinner color
                progressViewOffset={insets.top} // ✅ Moves spinner below header
              />
            }
            bounces={true}
            alwaysBounceVertical={true}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: scrollY } } }],
							{ useNativeDriver: false }
						)}
          >
            <View className="flex-1 px-4 pt-4 bg-card-background dark:bg-primary-dark/90 rounded-2xl">
              <View className="flex-row items-center my-4 space-x-2">
                <View className="flex-1">
                  <MainPageCards.CardButton
                    iconName="search"
                    title={t("dashboard.search-loads")}
                    subtitle={t('dashboard.find-loads')}
                    onPress={() => {
                      router.push('/search?tab=load');
                    }}
                  />
                </View>
                <View className="flex-1">
                  <MainPageCards.CardButton
                    iconName="car-outline"
                    title={t("dashboard.search-vehicles")}
                    subtitle={t('dashboard.find-vehicles')}
                    onPress={() => {
                      router.push('/search?tab=vehicle');
                    }}
                  />
                </View>
              </View>


              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">{t('dashboard.today-stats')}</Text>
                  <Text className="flex items-center text-sm text-gray-500">
                    <View className="w-2 h-2 mr-2 bg-green-500 rounded-full"></View>
                    {t('dashboard.live-updates')}
                  </Text>
                </View>
                
                <View className="flex-row space-x-4">
                  {loadStats && <View className="flex-1">
                      <MainPageCards.StatsCard
                        title={t('dashboard.load-ads')}
                        count={loadStats.today}
                        delta={loadStats.growth + "%"}
                        deltaText={t('date-range.yesterday')}
                        icon="cube-outline"
                      />
                  </View>}
                  
                  {vehicleStats && <View className="flex-1">
                    <MainPageCards.StatsCard
                      title={t('dashboard.vehicle-ads')}
                      count={vehicleStats.today}
                      delta={vehicleStats.growth + "%"}
                      deltaText={t('date-range.yesterday')}
                      icon="bus-outline"
                    />
                  </View>}
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">{t('dashboard.total-stats')}</Text>
                </View>
                
                <View className="flex-row justify-between space-x-4">
                  {loadStats && <MainPageCards.TotalStatsCard
                    icon="cube-outline"
                    count={loadStats.total}
                    label={t("dashboard.total-loads")}
                    growth="+12%"
                  />}
                  {vehicleStats && <MainPageCards.TotalStatsCard
                    icon="bus-outline"
                    count={vehicleStats.total}
                    label={t("dashboard.total-vehicles")}
                    growth="+8%"
                  />}
                </View>
                <View/>
            </View>
            </View>
          </Animated.ScrollView>
        </View>
      </LinearGradient>
      <LoadModal open={openModal} toggle={toggleModal}/>
    </View>
  );
}