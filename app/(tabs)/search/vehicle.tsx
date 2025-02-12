import { StyleSheet, Text, View, ScrollView, Keyboard, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import { CustomBadgeSelector, CustomButton, CustomInput, CustomInputSelector } from "@/components/custom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearVehicles, getVehicleCountries, getVehicleCountryCities, searchVehicles, setVehicle } from "@/redux/reducers/vehicle";
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getName } from '@/utils/general';
import { vehicleCountriesProps } from '@/interface/redux/variable.interface';
import { debounce } from 'lodash';
import { locationSearch } from '@/redux/reducers/city';
import { EmptyStateCard, VehicleGridCard, VehicleListCard } from '@/components/cards';
import VehicleModel from '@/models/vehicle';
import { ContentLoaderLoadGrid, ContentLoaderLoadList } from '@/components/content-loader';
import { OPTIONS } from '@/utils/constants';
import { stopLoading } from '@/redux/reducers/variable';

const SearchVehicleScreen = () => {
	const dispatch = useAppDispatch();
	const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const {activeCountries, activeCities, vehicles, loading, pagination, stats} = useAppSelector(state => state.vehicle);
  const {cities, loading: cityLoad} = useAppSelector(state => state.city);
	const [selectedCountry, setSelectedCountry] = React.useState<vehicleCountriesProps | null>(null); // Initialize with "" to avoid null
	const [selectedCity, setSelectedCity] = React.useState<vehicleCountriesProps | null>(null); // Initialize with "" to avoid null
  const [error, setError] = React.useState<string>("");
  // const [searchText, setSearchText] = React.useState<string>('');
  const [viewId, setViewId] = React.useState(null);
  const [isGridView, setIsGridView] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const booleanFiltersData = OPTIONS['boolean-filters'];
    const [booleanFilters, setBooleanFilters] = React.useState(() =>
      booleanFiltersData.reduce<Record<string, boolean>>((acc, filter) => {
        acc[filter.value] = false; // Har bir filterni default qiymatini false qilib boshlash
        return acc;
      }, {})
    );
    
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [selectedFitlers, setSelectedFilters] = React.useState<string[]>([]);
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    
  const RenderLoadItem = React.memo(({ item }: {item: VehicleModel}) => isGridView ? <VehicleGridCard onPress={() => toggleSetId(item)} vehicle={item} close={toggleModal} /> : 
    <VehicleListCard onPress={() => toggleSetId(item)} vehicle={item} close={toggleModal} />);
  const RenderContentLoadItem = React.memo(() => isGridView ? <ContentLoaderLoadList /> : <ContentLoaderLoadGrid />);

  const isLast = pagination?.totalPages === page;

  const debouncedFetchVehicles = React.useCallback(
    debounce(() => {
      fetchVehicles();
    }, 300), // 300ms ichida faqat bitta chaqiruv amalga oshiriladi
    [selectedCountry, selectedCity]
  )

  const handleCountryChange = (item: any) => setSelectedCountry(item);
  const handleCityChange = (item: any) => setSelectedCity(item);

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const toggleModal = () => {
    setOpenModal(!openModal)
  };
  
  const toggleSetId = (item: VehicleModel) => {
    setViewId(item.id);
    dispatch(setVehicle(item))
  }
  
  
	React.useEffect(()=> {
    dispatch(getVehicleCountries())
  },  []);

  React.useEffect(() => {
    if (selectedCountry) {
      dispatch(getVehicleCountryCities(selectedCountry.id || 0));
      debouncedFetchVehicles();
    }  
  }, [selectedCountry])

  React.useEffect(() => {
    console.log("selectedCity", selectedCity);
    
    if (selectedCity) {
      debouncedFetchVehicles();
    }
  }, [selectedCity])

  React.useEffect(() => {
    return () => {
      dispatch({
        type: 'vehicle/getVehicleCountries/fulfilled',
        payload: []
      })
      
      dispatch({
        type: 'vehicle/getVehicleCountryCities/fulfilled',
        payload: []
      })
    }  
  }, [])

  const onRefresh = () => {
    if (selectedCountry) {
      setRefreshing(true);
      dispatch(clearVehicles());
      // Ma'lumotlarni yangilash
      setTimeout(() => {
        fetchVehicles();
        setRefreshing(false); // Yangilashni tugatish
      }, 2000); // 2 soniyalik kechikish
    }
  };
  
  
  function requestParams() {
    let query: {
      limit: number;
      page: number;
      sort: string;
      isArchived: boolean;
      isDeleted: boolean;
      isDagruz?: boolean; // Qo‘shilayotgan property-lar optional bo‘lishi mumkin
      isWebAd?: boolean;
      isLikelyDispatcher?: boolean;
      truckTypes?: string;
      origin_country_id?: any;
      origin_city_id?: any;
    } = {
      limit: limit,
      page: page,
      sort: '!createdAt',
      isArchived: false,
      isDeleted: false,
    };
  
    if (booleanFilters['isDagruz']) {
      query.isDagruz = booleanFilters['isDagruz']; 
    }
  
    if (booleanFilters['isLikelyDispatcher']) {
      query.isLikelyDispatcher = booleanFilters['isLikelyDispatcher']; 
    }
  
    if (booleanFilters['isWebAd']) {
      query.isWebAd = booleanFilters['isWebAd']; 
    }
  
    if (selectedItems.length) {
      query.truckTypes = selectedItems.map((item) => item).join(', ');
    }
  
    if (selectedCountry) {
      query.origin_country_id = selectedCountry.id;
    }
  console.log("selectedCity query", selectedCity);
  
    if (selectedCity) {
      query.origin_city_id = selectedCity.id;
    }
  
    return query;
  }
  

  const fetchVehicles = async () => {
      try {
        if (!selectedCountry) {
          dispatch(clearVehicles());
          return;
        }

        const params = requestParams();
        await dispatch(searchVehicles(params));
      } catch (error) {
        console.error('Error fetching loads:', error);
      } finally {
        // dispatch(stopLoading());
      }
  };

    
  const handleBadgeChange = (value: string) => {
    setSelectedItems((prevSelected: string[]) =>
      prevSelected.includes(value)
        ? prevSelected.filter((itemValue) => itemValue !== value)
        : [...prevSelected, value]
    );
    debouncedFetchVehicles();
  };
  
  const onChange = (value: string) => {
    setBooleanFilters((prevFilters) => ({
      ...prevFilters,
      [value]: !prevFilters[value],
    }));
  
    setSelectedFilters((prevSelected: string[]) =>
      prevSelected.includes(value)
        ? prevSelected.filter((itemValue) => itemValue !== value)
        : [...prevSelected, value]
    );
    debouncedFetchVehicles();
  };
  
  // const debouncedFetchExtract = React.useCallback(
  //   debounce(() => {
  //     dispatch(locationSearch(searchText));
  //   }, 600), [searchText]
  // )
  
  // const handleDestinationChange =(text: string) => setSearchText(text)
  
  function onClear() {
    setSelectedCountry(null)
  }

  React.useEffect(() => {
    fetchVehicles();
  }, [page]);
  // React.useEffect(() => {
  //   if (searchText.length) {
  //     debouncedFetchExtract()
  //   }  
  // }, [searchText])

  const handleViewMore = () => {
    if (isLast) {
      setPage(1)
      dispatch(clearVehicles())
    } else {
      setPage(previus => previus + 1); 
    }
  }
  
  return (
    <View className="flex-1 bg-gray-100">
      <View style={styles.container}>
          <CustomInputSelector
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder='loads.origin-country'
            // error={error}
            loading={loading}
            items={activeCountries}
            labelField={'name_' + currentLanguage}
            valueField="id"
            search={false}
            onClear={onClear}
            rightData={(item) => <View className='flex-row items-center justify-center px-1 rounded-md bg-primary'>
              <Ionicons name='car' size={18} color={'white'} className=''/>
              <Text className='ml-1 text-xs text-white'>{item.vehicle_count}</Text>
            </View>}
            rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
          />
        
        <View className='my-2'/>

        <CustomInputSelector
            value={selectedCity}
            onChange={handleCityChange}
            placeholder='loads.origin-city'
            // error={error}
            loading={loading}
            items={activeCities}
            disabled={!selectedCountry}
            labelField={'name_' + currentLanguage}
            valueField="id"
            search={false}
            onClear={onClear}
            rightData={(item) => <View className='flex-row items-center px-1 rounded-md bg-primary'>
              <Ionicons name='car' size={18} color={'white'}/>
              <Text className='ml-1 text-xs text-white'>{item['vehicle_count']}</Text>
            </View>}
            rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
        />
  
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
                icon={isGridView ? 'list' : 'grid'} // Icon for toggle
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
                  data={vehicles as VehicleModel[]}
                  keyExtractor={(item) => item?.id ?? Math.random().toString()}
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
                  ListFooterComponent={<View className={`mb-3 ${(!vehicles.length || vehicles.length < limit) && 'hidden'}`}>
                    <CustomButton 
                        title={t (isLast ? 'show-less' : 'show-more', {
                          nextIndex: page * limit,
                          count: pagination?.totalCount
                        })} 
                        buttonStyle='bg-primary'
                        onPress={handleViewMore}
                        loading={loading}
                    />
                  </View>}
                  ListEmptyComponent={<EmptyStateCard type="vehicle"/>}
                  renderItem={({ item }: {item: VehicleModel}) => <RenderLoadItem item={item} />}
                  refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
            )}
            
			</View>
    </View>
  )
}

export default SearchVehicleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 20,
  },
});
