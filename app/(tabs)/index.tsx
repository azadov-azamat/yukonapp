import React, { useCallback, useMemo } from "react";
import { View, Text, RefreshControl, Animated, StatusBar, FlatList, Button } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { getTopSearches, fetchLatestLoads, getLoadStats, searchNearbyLoads, setLoad } from "@/redux/reducers/load";
import { useRouter } from "expo-router";
import { requestLocationPermission } from "@/utils/general";
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { LoadModal } from '@/components/modal'
import { EmptyStateCard, LoadListCard, MainPageCards } from "@/components/cards";
import { getVehicleStats } from "@/redux/reducers/vehicle";
import { ContentLoaderLoadList } from "@/components/content-loader";
import LoadModel from "@/models/load";
import { useBottomSheet } from "@/hooks/context/bottom-sheet";
import { CustomInputSelector } from "@/components/custom";
import { OPTIONS } from "@/utils/constants";
// import TelegramLogin from "@/components/modal/auth-telegram";
import * as Sentry from '@sentry/react-native';

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

type NearbyRadius = '10' | '20' | '30' | '40' | '50'

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { openLoadView } = useBottomSheet();
  const router = useRouter();
  
  // const [open, setOpen] = React.useState(false);
  // const toggle = () => setOpen(prev => !prev);
  
  const { location, user } = useAppSelector(state => state.auth);
  const { dashboardStats: loadStats, loadingSearchLoads, nearbyLoads } = useAppSelector(state => state.load);
  const { dashboardStats: vehicleStats } = useAppSelector(state => state.vehicle);

  const [openModal, setOpenModal] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [nearbyRadius, setNearbyRadius] = React.useState<{label: NearbyRadius; value: NearbyRadius}>({label: '10', value: '10'});

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

  // React.useEffect(() => {
  //   requestLocationPermission(dispatch);
  // }, []);
  
  React.useEffect(() => {
    if (location.length) {
      const query = {
        page: 1,
        limit: 10,
        sort: '!createdAt',
        isArchived: false,
        isDeleted: false,
        lat: location[0],
        lng: location[1],
        radius: nearbyRadius.value
      }
      dispatch(searchNearbyLoads(query));    
    }
    
    Sentry.captureMessage(`Foydalanuvchi tizimga kirdi: ${user?.telegramId}`, 'log');

  }, [location, nearbyRadius])

  // Combined focus effect for data fetching and cleanup
  // React.useEffect(() => {
  //   const abortController = new AbortController();
  //   let isSubscribed = true;

  //   const fetchData = async () => {
  //     if (!isSubscribed) return;
  //     try {
  //       await Promise.all([
  //         dispatch(getTopSearches()),
  //         dispatch(fetchLatestLoads())
  //       ]);
  //     } catch (error) {
  //       console.error('Fetch error:', error);
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     isSubscribed = false;
  //     abortController.abort();
  //     StatusBar.setBackgroundColor("transparent");
  //   };
  // }, []);

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

  const toggleSetId = useCallback((item: LoadModel) => {
    openLoadView();
    dispatch(setLoad(item));
  }, [dispatch]);

  const MemoizedContentLoadItem = React.memo(ContentLoaderLoadList);
  const MemoizedLoadListCard = React.memo(LoadListCard);
  
  const renderContentLoadItem = useCallback(() => (
      <MemoizedContentLoadItem />
    ), []);

  const renderLoadItem = useCallback(({ item }: {item: LoadModel}) => (
    <MemoizedLoadListCard
      changes={true} onPress={() => toggleSetId(item)} load={item}
    />
  ), [toggleSetId, toggleModal]);
  
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
                    iconName="cube"
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
                  {/* <Text className="flex items-center text-sm text-gray-500">
                    <View className="w-2 h-2 mr-2 bg-green-500 rounded-full"></View>
                    {t('dashboard.live-updates')}
                  </Text> */}
                </View>

                <View className="flex-row space-x-4">
                  {loadStats && <View className="flex-1">
                      <MainPageCards.StatsCard
                        title={t('dashboard.load-ads')}
                        count={loadStats.today}
                        delta={loadStats.growth + "%"}
                        deltaText={t('dashboard.compared-to-yesterday')}
                        icon="cube-outline"
                      />
                  </View>}

                  {vehicleStats && <View className="flex-1">
                    <MainPageCards.StatsCard
                      title={t('dashboard.vehicle-ads')}
                      count={vehicleStats.today}
                      delta={vehicleStats.growth + "%"}
                      deltaText={t('dashboard.compared-to-yesterday')}
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

                <View className="relative flex-row items-center justify-between flex-1">
                  <Text className="text-base font-bold text-gray-900">{t("dashboard.nearby-ads")}</Text>
                    <CustomInputSelector
                        divClass="m-0 p-0"
                        value={nearbyRadius}
                        onChange={(item) => setNearbyRadius(item)}
                        placeholder="table.action"
                        labelField='label'
                        valueField="value"
                        items={OPTIONS['radius']}
                        rowItem={(item) => <Text>{item.value}km</Text>}
                    />
                </View>

               <View className="-mt-4">
                  {
                    !location.length ? (
                      <View className="items-center py-10">
                        <Text className="mb-4 text-center text-gray-600">
                          {t("dashboard.location-permission-needed")}
                        </Text>
                        <MainPageCards.CardButton
                          iconName="location-outline"
                          title={t("dashboard.enable-location")}
                          subtitle={t("dashboard.tap-to-enable-location")}
                          disabled={true}
                          onPress={() => requestLocationPermission(dispatch)}
                        />
                      </View>
                    ) : loadingSearchLoads ? (
                      <FlatList
                        data={[1, 2, 3, 4, 6, 7]}
                        keyExtractor={(item) => item.toString()}
                        renderItem={renderContentLoadItem}
                      />
                    ) : (
                      <FlatList
                        data={nearbyLoads}
                        keyExtractor={(item) => String(item?.id) || '-'}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<EmptyStateCard type="load"/>}
                        renderItem={renderLoadItem}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                      />
                    )
                  }
                </View>

                <View/>
              </View>
            </View>
          </Animated.ScrollView>
        </View>
      </LinearGradient>
      <LoadModal open={openModal} toggle={toggleModal}/>
      {/* <TelegramLogin open={open} setOpen={setOpen}
        getRef={(ref: any) => { 
          console.log('TelegramLogin ref', ref);
          telegramRef.current = ref; 
        }}
       /> */}
    </View>
  );
}
