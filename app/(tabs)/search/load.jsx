import { Text, View, FlatList, Keyboard } from 'react-native'
import React from 'react'
import { OPTIONS } from '@/utils/constants'
import { CustomBadgeSelector, CustomButton, CustomInput } from '@/components/customs'
import LoadRouteSelector from '@/components/load-route-selector'
import { EmptyStateCard, LoadGridCard, LoadListCard } from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { searchLoads } from '@/redux/reducers/load'
import { useRoute } from '@react-navigation/native';
import { getExtractCity } from '@/redux/reducers/city'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash';
import { ContentLoaderLoadGrid, ContentLoaderLoadList } from '@/components/content-loader'
import { startLoading, stopLoading } from '@/redux/reducers/variable'
import LoadCardModal from '@/components/modal/load'

const SearchLoadScreen = () => {
    const route = useRoute();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {loads, pagination, stats} = useAppSelector(state => state.load);
    const { loading } = useAppSelector(state => state.variable);
    
    const [searchText, setSearchText] = React.useState('');
    const [dateRange, setDateRange] = React.useState([]);
    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const booleanFiltersData = OPTIONS['boolean-filters'];
    const [booleanFilters, setBooleanFilters] = React.useState(() =>
      booleanFiltersData.reduce((acc, filter) => {
        acc[filter.value] = false; // Har bir filterni default qiymatini false qilib boshlash
        return acc;
      }, {})
    );
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [selectedFitlers, setSelectedFilters] = React.useState([]);
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    
    const arrival = route.params?.arrival;
    const departure = route.params?.departure; 
    
    const [origin, setOrigin] = React.useState(null);
    const [destination, setDestination] = React.useState(null);
    const [isGridView, setIsGridView] = React.useState(false);

    const RenderLoadItem = React.memo(({ item }) => isGridView ? <LoadListCard {...item} /> : <LoadGridCard {...item} />);
    const RenderContentLoadItem = React.memo(() => isGridView ? <ContentLoaderLoadList /> : <ContentLoaderLoadGrid />);

    const toggleView = () => {
      setIsGridView((prev) => !prev);
    };

    const debouncedFetchExtract = React.useCallback(
      debounce(() => {
        fetchExtractCity();
      }, 300), // 300ms ichida faqat bitta chaqiruv amalga oshiriladi
    )

    const debouncedFetchLoads = React.useCallback(
      debounce(() => {
        fetchLoads();
      }, 300),
    )

        // 3. Arrival va departure page yuklanganda o'rnatiladi
    React.useEffect(() => {
      if (arrival) {
        setSearchText(`${arrival || ''} ${departure || ''}`);
        debouncedFetchExtract();
      } else {
        handleClear();
      }
    }, [arrival, departure]);

    // 4. Origin va destination o'zgarganda loadlarni fetch qilish
    React.useEffect(() => {
      if (origin) {
        dispatch(startLoading());
        debouncedFetchLoads();
      }
    }, [origin, destination]);

    React.useEffect(()=> {
      return () => {
        navigation.setParams({
          arrival: undefined, // Parametrni tozalash uchun undefined qilib o'rnating
          departure: undefined
        });
      }
    }, []);
    
    const handleSwapCities = () => {
      setOrigin((prevOrigin) => {
        const prevDestination = destination;
        setDestination(prevOrigin);
        return prevDestination;
      });
    };

    const handleClear = () => {
      setOrigin(null);
      setDestination(null);
      setSearchText('')
      navigation.setParams({
        arrival: undefined, // Parametrni tozalash uchun undefined qilib o'rnating
        departure: undefined
      });
      dispatch({ type: 'load/searchLoads/fulfilled', payload: [] });
    };
    
    const handleBadgeChange = (value) => {
      setSelectedItems((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((itemValue) => itemValue !== value)
          : [...prevSelected, value]
      );
      if (origin) {
        debouncedFetchExtract();
      }
    };

    const handleBookmark = () => {
        console.log('Bookmark clicked!');
    };

    function requestParams() {
        let query = {
          limit: limit,
          page: page,
          isArchived: false,
          isDeleted: false,
        };

        if (booleanFilters['isDagruz']) {
          query.isDagruz = booleanFilters['isDagruz'];
        }
    
        if (booleanFilters['hasPrepayment']) {
          query.hasPrepayment = booleanFilters['hasPrepayment'];
        }
    
        if (booleanFilters['isLikelyOwner']) {
          query.isLikelyOwner = booleanFilters['isLikelyOwner'];
        }
    
        if (booleanFilters['isWebAd']) {
          query.isWebAd = booleanFilters['isWebAd'];
        }

        if (selectedItems.length) {
          query.cargoTypes = selectedItems
            .map((item) => item)
            .join(', ');
        }
    
        if (origin?.country_id) {
          query.origin_city_id = origin.id;
          query.origin_country_id = origin.country_id;
        } else {
          query.origin_country_id = origin?.id;
        }
    
        if (destination && destination?.country_id) {
          query.destination_city_id = destination.id;
          query.destination_country_id = destination.country_id;
        } else {
          query.destination_country_id = destination?.id;
        }
    
        if (dateRange.length) {
          query.dateRange = dateRange;
        }

        return query;
      }
      
    // const updateQueryParams = React.useCallback((arrival, departure) => {
    //     navigation.setParams({
    //       arrival,
    //       departure,
    //   });
    // }, []);

    const fetchExtractCity = async() => {
      dispatch(startLoading());
      let search = arrival ? `${arrival} ${departure}` : searchText;
      const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
      const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
      if (!fetchedOrigin) {
        dispatch({ type: 'load/searchLoads/fulfilled', payload: [] });
        return;
      }
      // if (fetchedOrigin.name_uz !== arrival || fetchedDestination?.name_uz !== departure) {
      //   updateQueryParams(getCityName(fetchedOrigin), getCityName(fetchedDestination) || '');
      // }
      setOrigin(fetchedOrigin);
      setDestination(fetchedDestination || null);
    }

      const fetchLoads = async () => {
        try {
          if (!origin) {
            dispatch({ type: 'load/searchLoads/fulfilled', payload: [] });
            return;
          }
    
          const params = requestParams();
          await dispatch(searchLoads(params));
        } catch (error) {
          console.error('Error fetching loads:', error);
        } finally {
          dispatch(stopLoading());
        }
    };

    const handleDateSelect = (range) => {
      console.log("Tanlangan sana diapazoni:", range);
    };

    const onChange = (value) => {
      setBooleanFilters((prevFilters) => ({
        ...prevFilters,
        [value]: !prevFilters[value],
      }));
      setSelectedFilters((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((itemValue) => itemValue !== value)
          : [...prevSelected, value]
      );
      if (origin) {
        debouncedFetchExtract();
      }
    };
    
    const openViewModal =()=> {
      
    }
    
    return (
        <View className="flex-1 bg-gray-100">
            {origin ? (
               <LoadRouteSelector
                  origin={origin}
                  destination={destination}
                  onClear={handleClear}
                  onSwapCities={handleSwapCities}
              />
            ) : (<View className="flex-row items-center">
                <CustomInput
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)} 
                    placeholder={t ('search-by-destination')}
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
                     loading={loading}
                     buttonStyle="w-auto p-3 bg-primary ml-2"
                />
            </View>)}
            <View className='my-1'/>
            {pagination && <View className="flex-row items-center justify-between p-4 mt-2 bg-white rounded-md shadow-sm">
              <View>
                <Text className="text-sm font-bold text-gray-800">
                  {t ('query-result-message-without-cargo', {
                    count: pagination.totalCount,
                    todayCounter: stats?.loads_today
                    }
                  )}
                </Text>
              </View>
              <CustomButton
                iconName={isGridView ? 'list' : 'grid'} // Icon for toggle
                isIcon
                iconSize={18}
                onPress={toggleView}
                buttonStyle="bg-primary px-2 py-1"
              />
            </View>}
            <View className='my-1'/>
            {loading ? (
              <FlatList
              data={[1, 2, 3, 4, 6, 7]} // Foydalanilmaydigan placeholder massiv
              keyExtractor={(item) => item.toString()}
              renderItem={() => <RenderContentLoadItem />}
            />
            ) : (
              <FlatList
                  data={loads}
                  keyExtractor={(item) => item?.id?.toString()}
                  showsVerticalScrollIndicator={false}
                  // ItemSeparatorComponent={separatorComp}
                  ListHeaderComponent={
                    <View>
                       <CustomBadgeSelector
                      items={booleanFiltersData}
                      selectedItems={selectedFitlers}
                      onChange={onChange}
                    />
                      <CustomBadgeSelector
                      items={truckTypes}
                      selectedItems={selectedItems}
                      onChange={handleBadgeChange}
                    />
                    </View>
                  }
                  // ListFooterComponent={<Text>list Footer</Text>}
                  // onEndReached={loadMoreData} // Scroll pastga tushganda ishlatiladi
                  // onEndReachedThreshold={0.5}
                  // ListFooterComponent={
                  //   isFetchingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
                  // }
                  ListEmptyComponent={<EmptyStateCard type="load"/>}
                  renderItem={({ item }) => <RenderLoadItem item={item} />}
              />
            )}
            <LoadCardModal/>
        </View>
    )
}

export default SearchLoadScreen
