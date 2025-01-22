import React from "react";
import { CustomButton, CustomInput } from "@/components/customs";
import { Keyboard, View, Text, FlatList } from "react-native";
import { EmptyStateCard, PopularDirectionCard } from "@/components/cards";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';
import { getTopSearches } from "@/redux/reducers/load";
import { ContentLoaderTopSearches } from "@/components/content-loader";
import { debounce } from 'lodash';
import { getExtractCity } from "@/redux/reducers/city";
import { startLoading, stopLoading } from "@/redux/reducers/variable";
import { useRouter } from "expo-router";
import { getCityName } from "@/utils/general";

export default function MainPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const {topSearches, loading} = useAppSelector(state => state.load);
  const {loading: globalLoad} = useAppSelector(state => state.variable);
  
  const [searchText, setSearchText] = React.useState<string>('');
  
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
      dispatch({ type: 'load/searchLoads/fulfilled', payload: [] });
      return;
    }
    console.log(getCityName(fetchedOrigin), getCityName(fetchedDestination));
    
    dispatch(stopLoading());
    router.push(`/(tabs)/search?arrival=${getCityName(fetchedOrigin)}&departure=${getCityName(fetchedDestination)}`)
  }
  
  return (
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
                     iconName='search' 
                     isIcon 
                     onPress={debouncedFetchExtract}
                     loading={globalLoad}
                     disabled={globalLoad}
                     buttonStyle="w-auto p-3 bg-primary ml-2"
                />
            </View>
  
       <View className="">
          {/* Header */}
          <Text className="mb-4 text-lg font-bold text-center">
            {t ("top-five-searches")}
          </Text>

          {
            !loading ? (
                <FlatList
                  data={topSearches}
                  keyExtractor={(item, index) => `${item.origin.id}-${item.destination.id}-${index}`}
                  ListEmptyComponent={<EmptyStateCard type="load"/>}
                  renderItem={({ item }) => <PopularDirectionCard {...item}/>}
                />
            ) : (
              <FlatList
                data={[1, 2, 3, 4]}
                keyExtractor={(item) => item.toString()}
                renderItem={() => <ContentLoaderTopSearches />}
              />
            )
          }

      </View>
    </View>
  );
}
