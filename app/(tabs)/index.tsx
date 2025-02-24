import React from "react";
import { Keyboard, View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { EmptyStateCard, PopularDirectionCard, LatestLoadCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { clearLoads, getTopSearches, searchLoads, setLoad, clearLoad, getLoadById } from "@/redux/reducers/load";
import { ContentLoaderTopSearches } from "@/components/content-loader";
import { debounce } from 'lodash';
import { getExtractCity } from "@/redux/reducers/city";
import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { getCityName } from "@/utils/general";
import { TextInput } from "react-native-paper"; // ✅ Import Appbar from Paper
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LoadModal } from '@/components/modal'
// import { ILoadModel } from "@/interface/redux/load.interface";

const HEADER_HEIGHT = 50;

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const { topSearches, loads, loadingTopSearches, loadingSearchLoads, loadingLoadById } = useAppSelector(state => state.load);

  const [viewId, setViewId] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const [searchText, setSearchText] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);

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

  React.useEffect(() => {
    if (viewId) {
      toggleModal();
      dispatch(getLoadById(viewId));
    } else {
      // dispatch(clearLoad())
    }
  }, [viewId])


  const toggleSetId = (item: any) => {
    setViewId(item.id);
    dispatch(setLoad(item))
  }

  const toggleModal = () => {
    setOpenModal(!openModal)
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

		dispatch(getTopSearches());
		dispatch(searchLoads(params));
		dispatch(clearLoads());

    setRefreshing(false);
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
        <View className="z-10 flex-1 overflow-visible">
          <ScrollView
            className="flex-1"
            style={{ paddingTop: (HEADER_HEIGHT + insets.top) }}
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
            <View className="flex-1 bg-card-background dark:bg-primary-dark/90 pt-7 rounded-2xl">
              <View className="flex-row items-center mx-4 mb-8">
                <View className="relative justify-center w-full">
                  <TextInput
                    mode="outlined"
                    placeholder={t ('search-by-destination')}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    className="w-full overflow-auto shadow bg-primary-white dark:bg-primary-dark-sm pl-2.5"
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
                    // style={styles.iconButton}
                    className="absolute items-center justify-center transform translate-y-[-12] rounded-full right-4 top-4 w-9"
                    onPress={() => {
                      Keyboard.dismiss();
                      debouncedFetchExtract();
                    }}>
                    <Ionicons name="search" size={24} color="#623bff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6">
                <Text className="px-6 mb-4 text-lg font-bold uppercase text-primary-title-color dark:text-primary-light">
                  {t ("latest-ads")}
                </Text>

                {
                  !loadingSearchLoads ? (
                    <FlashList
                      data={loads}
                      keyExtractor={(item, index) => `${item.id}-${index}`}
                      ListEmptyComponent={<EmptyStateCard type="load" />}
                      renderItem={({ item }) => <LatestLoadCard onPress={() => toggleSetId(item)} load={item} close={toggleModal} />}
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
                <Text className="px-6 mb-4 text-lg font-bold uppercase text-primary-title-color dark:text-primary-light">
                  {t ("top-searches")}
                </Text>

                {
                  !loadingTopSearches ? (
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

