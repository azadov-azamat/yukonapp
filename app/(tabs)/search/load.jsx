import { Text, ScrollView, View, FlatList } from 'react-native'
import React from 'react'
import BadgeSelector from '@/components/customs/badge-selector'
import { OPTIONS } from '@/utils/constants'
import { CustomButton, CustomInput } from '@/components/customs'
import LoadRouteSelector from '@/components/load-route-selector'
import { LoadListCard } from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { searchLoads } from '@/redux/reducers/load'
import { useRoute } from '@react-navigation/native';
import { getExtractCity } from '@/redux/reducers/city'
import { useNavigation } from '@react-navigation/native';
import { dateFromNow, formatPrice, formatRelativeTime } from '@/utils/general'
import { useTranslation } from 'react-i18next'
import { date } from 'yup'

const SearchLoadScreen = () => {
    const route = useRoute();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {loads, loading} = useAppSelector(state => state.load);
    const {loading: cityLoad} = useAppSelector(state => state.city);
    
    const [searchText, setSearchText] = React.useState('');
    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    
    const arrival = route.params?.arrival;
    const departure = route.params?.departure; 
    
    const handleBadgeChange = (value) => {
        setSelectedItems((prevSelected) =>
          prevSelected.includes(value)
            ? prevSelected.filter((itemValue) => itemValue !== value)
            : [...prevSelected, value] 
        );
        if (origin) {
          fetchLoads();
        }
    };
    
    const [origin, setOrigin] = React.useState(null);
    const [destination, setDestination] = React.useState(null);
  
    React.useEffect(() => {
         if (arrival) {
          setSearchText(`${arrival} ${departure}`);
          fetchLoads();
        }
      }, [arrival, departure]);
    
    const handleSwapCities = () => {
      setOrigin((prevOrigin) => {
        const prevDestination = destination;
        setDestination(prevOrigin);
        return prevDestination;
      });
      
      updateQueryParams(origin.name_uz, destination.name_uz);
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
    
    const handleBookmark = () => {
        console.log('Bookmark clicked!');
    };

    function requestParams() {
        let query = {
          limit: limit,
          page: page,
        //   sort: sort,
          isArchived: false,
          isDeleted: false,
        };
    
        // if (this.priceRange[0] !== '' && this.priceRange[0] !== null) {
        //   query.price = this.priceRange;
        // }
    
        // if (this.weightRange[0] !== '' && this.weightRange[0] !== null) {
        //   query.weight = this.weightRange;
        // }
    
        // if (this.isDagruz) {
        //   query.isDagruz = this.isDagruz;
        // }
    
        // if (this.hasPrepayment) {
        //   query.hasPrepayment = this.hasPrepayment;
        // }
    
        // if (this.isLikelyOwner) {
        //   query.isLikelyOwner = this.isLikelyOwner;
        // }
    
        // if (this.isWebAd) {
        //   query.isWebAd = this.isWebAd;
        // }
    
        // if (truckType && truckType?.value !== 'any') {
        //   query.cargoType = truckType.value;
        // }
    
        if (selectedItems.length) {
          query.cargoTypes = selectedItems
            .map((item) => item?.value)
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
    
        // if (this.dateRange.length) {
        //   query.dateRange = this.dateRange;
        // }
    
        return query;
      }
      
      const updateQueryParams = (arrival, departure) => {
        navigation.setParams({
            arrival, 
            departure
        });
      };
      
      const fetchLoads = async () => {
        try {
          const cityResponse = await dispatch(getExtractCity({ search: searchText || `${arrival} ${departure}` })).unwrap();
          const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
    
          if (!fetchedOrigin) {
            dispatch({ type: 'load/searchLoads/fulfilled', payload: [] });
            return;
          }
    
          setOrigin(fetchedOrigin);
          setDestination(fetchedDestination || null);
          updateQueryParams(fetchedOrigin.name_uz, fetchedDestination?.name_uz || '');
    
          const params = requestParams();
          await dispatch(searchLoads(params));
        } catch (error) {
          console.error('Error fetching loads:', error);
        }
    };
    
    return (
        <ScrollView className="flex-1 bg-gray-100">
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
                />
                <CustomButton
                     iconName='search' 
                     isIcon 
                     onPress={fetchLoads}
                     loading={loading || cityLoad}
                     buttonStyle="w-auto p-3 bg-primary ml-2"
                />
            </View>)}
            <View className='my-1'/>
            <BadgeSelector 
                items={truckTypes} 
                selectedItems={selectedItems} 
                onChange={handleBadgeChange} 
            />
              <FlatList
                data={loads}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={styles.contentContainer}
                // ItemSeparatorComponent={separatorComp}
                // ListHeaderComponent={headerComp}
                // ListFooterComponent={footerComp}
                // ListFooterComponentStyle={styles.footerComp}
                ListEmptyComponent={<Text>No Items</Text>}
                renderItem={({item}) => (
                  <LoadListCard {...item}/>
                )}
            />
        </ScrollView>
    )
}

export default SearchLoadScreen