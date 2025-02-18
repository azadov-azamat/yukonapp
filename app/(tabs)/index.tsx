import React from "react";
import { CustomButton, CustomInput } from "@/components/custom";
import { Keyboard, View, Text, FlatList, RefreshControl } from "react-native";
import { EmptyStateCard, PopularDirectionCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { clearLoads, getTopSearches } from "@/redux/reducers/load";
import { ContentLoaderTopSearches } from "@/components/content-loader";
import { debounce } from 'lodash';
import { getExtractCity } from "@/redux/reducers/city";
import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { getCityName } from "@/utils/general";
import { Appbar, List, Card } from "react-native-paper"; // ✅ Import Appbar from Paper
import { useTheme } from "@/config/ThemeContext";
import StickyHeader from "@/components/sticky-header"; // Import the Sticky Header
import { FlashList } from "@shopify/flash-list";

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const {topSearches, loading} = useAppSelector(state => state.load);
  const {loading: globalLoad} = useAppSelector(state => state.variable);
  
  const [searchText, setSearchText] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);

  const { theme } = useTheme();
  
  React.useEffect(()=> {
    dispatch(getTopSearches())
  },  []);

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

    // Ma'lumotlarni yangilash
    setTimeout(() => {
      dispatch(getTopSearches())
      setRefreshing(false); // Yangilashni tugatish
    }, 2000); // 2 soniyalik kechikish
  };

  return (
    <StickyHeader refreshing={refreshing} onRefresh={onRefresh}>
      <View className="flex-1 p-4 bg-gray-100">
        <View className="flex-row items-center mb-6">
          <CustomInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            placeholder={t ('search-by-destination-main')}
            divClass='flex-1'
            onSubmitEditing={() => {
              Keyboard.dismiss(); // Klaviaturani yopish
              debouncedFetchExtract(); // Funksiyani ishga tushirish
            }}
            returnKeyType="search"
          />
          <CustomButton
            onPress={debouncedFetchExtract}
            buttonStyle="w-auto p-3 bg-primary ml-2"
            loading={globalLoad}
            disabled={globalLoad}
            isIcon={true}
            icon="search"
          />
        </View>

        <View className="">
          {/* Header */}
          <Text className="mb-4 text-lg font-bold text-center">
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
                data={[1, 2, 3, 4]}
                keyExtractor={(item) => item.toString()}
                renderItem={() => <ContentLoaderTopSearches />}
                estimatedItemSize={50} // ✅ Adjust for smaller placeholders
              />
            )
          }
        </View>
      </View>
    </StickyHeader>
  );
}
