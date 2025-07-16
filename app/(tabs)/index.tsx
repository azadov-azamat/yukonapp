import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, RefreshControl, Animated, StatusBar } from "react-native";
// import { EmptyStateCard, PopularDirectionCard, LatestLoadCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { getTopSearches, fetchLatestLoads, getLoadStats } from "@/redux/reducers/load";
// import { ContentLoaderTopSearches } from "@/components/content-loader";
// import { debounce, get } from 'lodash';
// import { getExtractCity } from "@/redux/reducers/city";
// import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { requestLocationPermission } from "@/utils/general";
// import { TextInput } from "react-native-paper"; // ✅ Import Appbar from Paper
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
// import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
import { LoadModal } from '@/components/modal'
import { MainPageCards } from "@/components/cards";
import { getVehicleStats } from "@/redux/reducers/vehicle";
// import SubscriptionModel from "@/models/subscription";
// import { useBottomSheet } from '@/hooks/context/bottom-sheet';

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const { dashboardStats: loadStats } = useAppSelector(state => state.load);
  const { dashboardStats: vehicleStats } = useAppSelector(state => state.vehicle);
  
  // const { topSearches, latestLoads, loadingTopSearches, loadingLatestLoads, loadingLoadById } = useAppSelector(state => state.load);

  const [openModal, setOpenModal] = React.useState(false);
  // const [searchText, setSearchText] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  // const [subscription, setSubscription] = React.useState<SubscriptionModel | null>(null);
  // const openLoadView = useBottomSheet().openLoadView;
  
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

  // React.useEffect(() => {
  //   async function checkSubscription() {
  //     if (!user) return;
  //     const { active, subscription } = await user.hasActiveSubscription();
  //     if (active) {
  //       setSubscription(subscription || null);
  //     }
  //   } 
    
  //   checkSubscription();
  // }, [user])

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
  
  // Memoize child components
  // const MemoizedLatestLoadCard = React.memo(LatestLoadCard);
  // const MemoizedPopularDirectionCard = React.memo(PopularDirectionCard);
  // const MemoizedContentLoader = React.memo(ContentLoaderTopSearches);

  // Memoize callbacks
  // const toggleSetId = useCallback((item: any) => {
  //   openLoadView();
  //   dispatch(setLoad(item));
  // }, [dispatch]);

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

  // const debouncedFetchExtract = React.useCallback(
  //   debounce(() => {
  //     fetchExtractCity(searchText);
  //   }, 300), [searchText]
  // )

  // Cleanup for debounced function
  // React.useEffect(() => {
  //   return () => {
  //     debouncedFetchExtract.cancel();
  //   };
  // }, [debouncedFetchExtract]);

  // Cleanup for animated value
  React.useEffect(() => {
    return () => {
      scrollY.removeAllListeners();
    };
  }, [scrollY]);

  // const fetchExtractCity = async (search: string) => {
  //   if (!search) return;
  //   dispatch(startLoading());
  //   const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
  //   const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
  //   if (!fetchedOrigin) {
  //     return;
  //   }

  //   dispatch(stopLoading());
  //   router.push(`/(tabs)/search?arrival=${getCityName(fetchedOrigin)}&departure=${getCityName(fetchedDestination)}`)
  // }

  // const getItemKey = useCallback((item: any, index: number) =>
  //   `${item.id}-${index}`, []);

  // const renderLatestLoad = useCallback(({ item }: { item: any }) => (
  //   <MemoizedLatestLoadCard
  //     onPress={() => toggleSetId(item)}
  //     load={item}
  //     close={toggleModal}
  //   />
  // ), [toggleSetId, toggleModal]);

    
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
        <View className="z-10 flex-1 overflow-visible">
          <Animated.ScrollView
            className="flex-1"
            style={{ paddingTop: HEADER_HEIGHT }}
            contentContainerStyle={styles.scrollContent}
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
                    title="Search Load"
                    subtitle="Find available loads"
                    onPress={() => {
                      router.push('/search?tab=load');
                    }}
                  />
                </View>
                <View className="flex-1">
                  <MainPageCards.CardButton
                    iconName="car-outline"
                    title="Search Vehicle"
                    subtitle="Find transport vehicles"
                    onPress={() => {
                      router.push('/search?tab=vehicle');
                    }}
                  />
                </View>
              </View>


              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Today's Statistics</Text>
                  <Text className="flex items-center text-sm text-gray-500">
                    <View className="w-2 h-2 mr-2 bg-green-500 rounded-full"></View>
                    Live updates
                  </Text>
                </View>
                
                <View className="flex-row space-x-4">
                  {loadStats && <View className="flex-1">
                      <MainPageCards.StatsCard
                        title="Load Ads"
                        count={loadStats.today}
                        delta={loadStats.growth + "%"}
                        deltaText="yesterday"
                        icon="cube-outline"
                      />
                  </View>}
                  
                  {vehicleStats && <View className="flex-1">
                    <MainPageCards.StatsCard
                      title="Vehicle Ads"
                      count={vehicleStats.today}
                      delta={vehicleStats.growth + "%"}
                      deltaText="yesterday"
                      icon="bus-outline"
                    />
                  </View>}
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Total statistics</Text>
                </View>
                
                <View className="flex-row justify-between space-x-4">
                  {loadStats && <MainPageCards.TotalStatsCard
                    icon="cube-outline"
                    count={loadStats.total}
                    label="Total Loads"
                    growth="+12%"
                  />}
                  {vehicleStats && <MainPageCards.TotalStatsCard
                    icon="bus-outline"
                    count={vehicleStats.total}
                    label="Total Vehicles"
                    growth="+8%"
                  />}
                </View>

                {/* <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Subscription Status</Text>
                  <Text className="flex items-center text-sm text-gray-500">
                    <View className="w-2 h-2 mr-2 bg-green-500 rounded-full"></View>
                    Live updates
                  </Text>
                </View> */}
                
                {/* {subscription && <SubscriptionCard subscription={subscription} />} */}
                {/* <MainPageCards.SubscriptionStatusCard subscription={subscription} /> */}
                
                <View/>
            </View>
           
              {/* <View className="mb-6">
                <Text className="px-6 mb-4 text-lg font-bold uppercase text-primary-title-color dark:text-primary-light">
                  {t ("latest-ads")}
                </Text>

                {
                  !loadingLatestLoads ? (
                    <FlashList
                      data={latestLoads}
                      keyExtractor={getItemKey}
                      renderItem={renderLatestLoad}
                      estimatedItemSize={100}
                    />
                  ) : (
                    <FlashList
                      data={[1, 2, 3, 4, 5]}
                      keyExtractor={(item) => item.toString()}
                      renderItem={() => <MemoizedContentLoader />}
                      estimatedItemSize={50} // ✅ Adjust for smaller placeholders
                    />
                  )
                }
              </View>*/}

              {/* <View className="pb-5">
                <Text className="px-6 mb-4 text-lg font-bold uppercase text-primary-title-color dark:text-primary-light">
                  {t ("top-searches")}
                </Text>

                {
                  !loadingTopSearches ? (
                    <FlashList
                      data={topSearches}
                      keyExtractor={(item, index) => `${item.origin.id}-${item.destination.id}-${index}`}
                      ListEmptyComponent={<EmptyStateCard type="load" />}
                      renderItem={({ item }) => <MemoizedPopularDirectionCard {...item} />}
                      estimatedItemSize={100}
                    />
                  ) : (
                    <FlashList
                      data={[1, 2, 3, 4, 5]}
                      keyExtractor={(item) => item.toString()}
                      renderItem={() => <MemoizedContentLoader />}
                      estimatedItemSize={50} // ✅ Adjust for smaller placeholders
                    />
                  )
                }
              </View> */}
            </View>
          </Animated.ScrollView>
        </View>
      </LinearGradient>
      <LoadModal open={openModal} toggle={toggleModal}/>
    </View>
  );
}


// Styles
const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    zIndex: 1, // ✅ Ensures content is behind the header
    overflow: "visible",
  },
  scrollContent: {
    // paddingBottom: 180,
    // minHeight: "100%", // ✅ Ensure content is scrollable
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2, // Slight shadow effect
    paddingLeft: 10,
  },
  iconButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    borderRadius: 20,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

