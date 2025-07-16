import React, { useCallback, useEffect, useMemo } from "react";
import { Keyboard, View, Text, StyleSheet, RefreshControl, TouchableOpacity, Animated, StatusBar, ActivityIndicator, Platform, PermissionsAndroid, Button } from "react-native";
import { EmptyStateCard, PopularDirectionCard, LatestLoadCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { getTopSearches, setLoad, fetchLatestLoads } from "@/redux/reducers/load";
import { ContentLoaderTopSearches } from "@/components/content-loader";
import { debounce } from 'lodash';
import { getExtractCity } from "@/redux/reducers/city";
import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { getCityName, requestLocationPermission } from "@/utils/general";
import { TextInput } from "react-native-paper"; // ✅ Import Appbar from Paper
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LoadModal } from '@/components/modal'
import { useBottomSheet } from '@/hooks/context/bottom-sheet';

const HEADER_HEIGHT = 50;
const SCROLL_THRESHOLD = 30;

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const { topSearches, latestLoads, loadingTopSearches, loadingLatestLoads, loadingLoadById } = useAppSelector(state => state.load);

  const [openModal, setOpenModal] = React.useState(false);
  const [searchText, setSearchText] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const openLoadView = useBottomSheet().openLoadView;

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
  useEffect(() => {
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

  // Memoize child components
  const MemoizedLatestLoadCard = React.memo(LatestLoadCard);
  const MemoizedPopularDirectionCard = React.memo(PopularDirectionCard);
  const MemoizedContentLoader = React.memo(ContentLoaderTopSearches);

  // Memoize callbacks
  const toggleSetId = useCallback((item: any) => {
    openLoadView();
    dispatch(setLoad(item));
  }, [dispatch]);

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

  const debouncedFetchExtract = React.useCallback(
    debounce(() => {
      fetchExtractCity(searchText);
    }, 300), [searchText]
  )

  // Cleanup for debounced function
  React.useEffect(() => {
    return () => {
      debouncedFetchExtract.cancel();
    };
  }, [debouncedFetchExtract]);

  // Cleanup for animated value
  React.useEffect(() => {
    return () => {
      scrollY.removeAllListeners();
    };
  }, [scrollY]);

  const fetchExtractCity = async (search: string) => {
    if (!search) return;
    dispatch(startLoading());
    const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
    const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
    if (!fetchedOrigin) {
      return;
    }

    dispatch(stopLoading());
    router.push(`/(tabs)/search?arrival=${getCityName(fetchedOrigin)}&departure=${getCityName(fetchedDestination)}`)
  }

  const getItemKey = useCallback((item: any, index: number) =>
    `${item.id}-${index}`, []);

  const renderLatestLoad = useCallback(({ item }: { item: any }) => (
    <MemoizedLatestLoadCard
      onPress={() => toggleSetId(item)}
      load={item}
      close={toggleModal}
    />
  ), [toggleSetId, toggleModal]);

  const CardButton = React.memo(({ iconName, title, subtitle, onPress }: {
    iconName: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress?: () => void
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="relative flex flex-col items-center w-full py-4 space-y-4 text-white bg-purple-700 hover:bg-purple-800 rounded-2xl"
    >
      <View className="absolute flex items-center justify-center w-12 h-12 bg-purple-600 shadow-lg -top-6 rounded-2xl">
        <Ionicons name={iconName} size={24} color="#FFF" />
      </View>
      <View className="text-center">
        <Text className="block text-base font-bold text-white">{title}</Text>
        <Text className="text-xs text-white opacity-80">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  ));

  const StatsCard = React.memo(({
      title,
      count,
      icon,
      delta,
      deltaText,
    }: {
      title: string;
      count: number;
      icon: keyof typeof Ionicons.glyphMap;
      delta: string;
      deltaText: string;
    }) => (
      <View className="flex-col p-4 space-y-2 bg-white shadow-md rounded-2xl dark:bg-primary-dark">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-500">{title}</Text>
            <Text className="mt-1 text-3xl font-bold text-purple-700">{count}</Text>
          </View>
          <View className="items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
            <Ionicons name={icon} size={20} color="#8b5cf6" />
          </View>
        </View>
        <Text className="mt-1 text-xs text-green-600">↑ {delta} vs {deltaText}</Text>
      </View>
    ));

    const TotalStatsCard = React.memo(({ icon, count, label, growth }: {
      icon: keyof typeof Ionicons.glyphMap;
      count: number;
      label: string;
      growth: string;
    }) => {
      return (
        <View className="items-center flex-1 space-y-2">
          <View className="items-center justify-center w-12 h-12 bg-purple-600 shadow rounded-2xl">
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">{count.toLocaleString()}</Text>
          <Text className="text-sm text-gray-500">{label}</Text>
          <View className="px-3 py-1 bg-green-100 rounded-full">
            <Text className="text-xs font-medium text-green-700">↑ {growth} this week</Text>
          </View>
        </View>
      );
    });
    
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
                  <CardButton
                    iconName="search"
                    title="Search Load"
                    subtitle="Find available loads"
                    onPress={() => {
                      router.push('/search');
                    }}
                  />
                </View>
                <View className="flex-1">
                  <CardButton
                    iconName="car-outline"
                    title="Search Vehicle"
                    subtitle="Find transport vehicles"
                    onPress={() => {
                      router.push('/search');
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
                  <View className="flex-1">
                      <StatsCard
                        title="Load Ads"
                        count={24}
                        delta="+15%"
                        deltaText="yesterday"
                        icon="cube-outline"
                      />
                  </View>
                <View className="flex-1">
                    <StatsCard
                      title="Vehicle Ads"
                      count={18}
                      delta="+8%"
                      deltaText="yesterday"
                      icon="bus-outline"
                    />
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Total statistics</Text>
                </View>
                
                <View className="flex-row justify-between space-x-4">
                  <TotalStatsCard
                    icon="cube-outline"
                    count={1247}
                    label="Total Loads"
                    growth="+12%"
                  />
                  <TotalStatsCard
                    icon="bus-outline"
                    count={892}
                    label="Total Vehicles"
                    growth="+8%"
                  />
                </View>

                  <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Total statistics</Text>
                </View>
                
                <View className="flex-row justify-between space-x-4">
                  <TotalStatsCard
                    icon="cube-outline"
                    count={1247}
                    label="Total Loads"
                    growth="+12%"
                  />
                  <TotalStatsCard
                    icon="bus-outline"
                    count={892}
                    label="Total Vehicles"
                    growth="+8%"
                  />
                </View>
                
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

