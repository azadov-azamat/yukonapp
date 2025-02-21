import React from "react";
import { CustomButton, CustomInput } from "@/components/custom";
import { Keyboard, View, Text, FlatList, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { EmptyStateCard, PopularDirectionCard, LoadListCard, LoadGridCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { clearLoads, getTopSearches, searchLoads, setLoad, clearLoad, getLoadById } from "@/redux/reducers/load";
import { ContentLoaderTopSearches } from "@/components/content-loader";
import { debounce } from 'lodash';
import { getExtractCity } from "@/redux/reducers/city";
import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { getCityName } from "@/utils/general";
import { Appbar, List, Card, TextInput } from "react-native-paper"; // ✅ Import Appbar from Paper
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { FlashList } from "@shopify/flash-list";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const HEADER_HEIGHT = 50;

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const { topSearches, loading, loads } = useAppSelector(state => state.load);
  const {loading: globalLoad} = useAppSelector(state => state.variable);

  const [viewId, setViewId] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const [searchText, setSearchText] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [isRefreshingFetch, setIsRefreshingFetch] = React.useState(false);

  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const params = {
    limit: 10,
    sort: '!createdAt',
    isArchived: false,
    isDeleted: false,
  }
  
  React.useEffect(()=> {
    dispatch(getTopSearches());
    dispatch(searchLoads(params));
  }, []);

  React.useEffect(() => {
    if (!openModal) {
      setViewId(null);
    }
  }, [openModal])


  const toggleSetId = (item) => {
    setViewId(item.id);
    dispatch(setLoad(item))
  }

  const toggleModal = () => {
    setOpenModal(!openModal)
  };

  const handleReloadAds = () => {
    dispatch(searchLoads(params));
  };

  const debouncedFetchExtract = React.useCallback(
    debounce(() => {
      fetchExtractCity(searchText);
    }, 300), [searchText]
  )
  
  const fetchExtractCity = async (search: string) => {
    if (!search) return;
    dispatch(startLoading());
    const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
    const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
    if (!fetchedOrigin) {
      dispatch(clearLoads());
      return;
    }
    
    dispatch(stopLoading());
    router.push(`/(tabs)/search?arrival=${getCityName(fetchedOrigin)}&departure=${getCityName(fetchedDestination)}`)
  }
  
  const onRefresh = () => {
    setRefreshing(true);
    setIsRefreshingFetch(true);

    // Ma'lumotlarni yangilash
    setTimeout(() => {
      dispatch(getTopSearches());
      dispatch(searchLoads(params)).finally(() => {
        setRefreshing(false);
        setIsRefreshingFetch(false);  // ✅ Allow EmptyComponent only after refresh ends
      });
      dispatch(clearLoads());
    }, 2000); // 2 soniyalik kechikish
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#623bff', '#CCADFF', '#FFFFFF']}
        locations={[0, 0.5, 1]}  // 50% gradient, 50% white
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}   // Start from the top
        end={{ x: 0, y: 1 }}     // End at the bottom
      >
        <StickyHeader />
        <View style={styles.scrollWrapper}>
          <ScrollView
            style={{ flex: 1, paddingTop: (HEADER_HEIGHT + insets.top) }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            // onScroll={handleScroll}
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
          >
            <View className="flex-1 pt-7 bg-gray-100 rounded-2xl">
              <View className="flex-row mx-4 items-center mb-8">
                <View style={styles.inputWrapper}>
                  <TextInput
                    mode="outlined"
                    placeholder={t ('search-by-destination')}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    style={styles.input}
                    returnKeyType="search" // Changes the keyboard button to "Search"
                    theme={{
                      roundness: 25,
                      colors: {
                        outline: '#623bff', // Outline color
                      },
                    }}
                    onSubmitEditing={() => { // Triggered when Enter is pressed
                      Keyboard.dismiss();
                      debouncedFetchExtract();
                    }}
                  />
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      debouncedFetchExtract();
                    }}>
                    <Ionicons name="search" size={24} color="#623bff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6">
                {/* Header */}
                <Text className="uppercase text-lg font-bold mb-4 px-6">
                  {t ("latest-ads")}
                </Text>

                {
                  !loading && !isRefreshingFetch ? (
                    <FlashList
                      data={loads}
                      keyExtractor={(item, index) => `${item.id}-${index}`}
                      ListEmptyComponent={<EmptyStateCard type="load" />}
                      renderItem={({ item }) => <LoadListCard onPress={() => toggleSetId(item)} load={item} close={toggleModal} />}
                      estimatedItemSize={100}
                    />
                  ) : (
                    <FlashList
                      data={[1, 2, 3, 4, 5]}
                      keyExtractor={(item) => item.toString()}
                      renderItem={() => <ContentLoaderTopSearches />}
                      estimatedItemSize={50} // ✅ Adjust for smaller placeholders
                    />
                  )
                }
              </View>

              <View className="pb-5">
                {/* Header */}
                <Text className="uppercase text-lg font-bold mb-4 px-6">
                  {t ("top-searches")}
                </Text>

                {
                  !loading ? (
                    <FlashList
                      data={topSearches}
                      keyExtractor={(item, index) => `${item.origin.id}-${item.destination.id}-${index}`}
                      ListEmptyComponent={<EmptyStateCard type="load" />}
                      renderItem={({ item }) => <PopularDirectionCard {...item} />}
                      estimatedItemSize={100}
                    />
                  ) : (
                    <FlashList
                      data={[1, 2, 3, 4, 5]}
                      keyExtractor={(item) => item.toString()}
                      renderItem={() => <ContentLoaderTopSearches />}
                      estimatedItemSize={50} // ✅ Adjust for smaller placeholders
                    />
                  )
                }
              </View>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
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
    width: '100%',
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

