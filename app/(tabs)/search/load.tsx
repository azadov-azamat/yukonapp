import { StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import BadgeSelector from '@/components/customs/badge-selector'
import { OPTIONS } from '@/utils/constants'
import { CustomButton, CustomInput } from '@/components/customs'
import LoadRouteSelector from '@/components/load-route-selector'
import { LoadListCard } from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { searchLoads } from '@/redux/reducers/load'
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/core';
import { viewSelectorTabs } from '@/interface/components'
import { getExtractCity } from '@/redux/reducers/city'
import { extractCityProps, itemCityProps } from '@/interface/redux/variable.interface'

type RootStackParamList = {
    SearchLoad: {
      arrival: string;
      departure: string;
      truckValue: string;
    };
  };
  
  type RouteParams = RouteProp<RootStackParamList, 'SearchLoad'>;
  
const SearchLoadScreen = () => {
    const route = useRoute<RouteParams>();
    const dispatch = useAppDispatch();
    
    const city = useAppSelector(state => state.city);
    
    const [searchText, setSearchText] = React.useState('');
    const [truckType, setTruckType] = React.useState<viewSelectorTabs | null | undefined>(null);
    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified') as viewSelectorTabs[];
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [limit, setLimit] = React.useState<number>(10);
    const [page, setPage] = React.useState<number>(1);
    
    const handleBadgeChange = (id: string) => {
        setSelectedItems((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((itemId) => itemId !== id)
            : [...prevSelected, id] 
        );
    };
    
    const [origin, setOrigin] = React.useState<itemCityProps | null>(null);
    const [destination, setDestination] = React.useState<itemCityProps | null>(null);
  
    React.useEffect(()=> {
        if (route.params?.truckValue) {
            setTruckType(truckTypes.find(item => item.value === route.params?.truckValue))
        }

        if (route.params?.arrival) {
            const arrival = route.params?.arrival;
            const departure = route.params?.departure || '';
            setSearchText(`${arrival} ${departure}`)
            setTimeout(()=> {
                fetchLoads();
            }, 500)
        }
    }, [route.params]);
    
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
    };
    
    const handleBookmark = () => {
        console.log('Bookmark clicked!');
    };

    function requestParams() {
        let query: any = {
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
    
        if (truckType && truckType?.value !== 'any') {
          query.cargoType = truckType.value;
        }
    
        // if (selectedItems.length) {
        //   query.cargoTypes = selectedItems
        //     .map((item) => item?.value)
        //     .join(', ');
        // }
    
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
      
    const fetchLoads = async () => {
        console.log("searchLoads", searchText);
        
        const res = await dispatch(getExtractCity({search: searchText}))
        const {origin, destination} = res.payload;
        
        if (!origin) {
            dispatch({
                type: 'load/searchLoads/fulfilled',
                payload: []
            })
            return;
        }
        setOrigin(origin);
        if (destination) {
            setDestination(destination);
        }
        
        await dispatch(searchLoads(requestParams));
    };
    
    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="flex-row items-center">
                <CustomInput
                    value={searchText}
                    onChangeText={(text: string) => setSearchText(text)} 
                    placeholder="Misol uchun: Towkentdan urganchga"
                    divClass='flex-1'
                />
                <CustomButton
                     iconName='search' 
                     isIcon 
                     onPress={fetchLoads}
                     
                     buttonStyle="w-auto p-3 bg-primary ml-2"
                />
            </View>
            <View className='my-1'/>
            <BadgeSelector 
                items={truckTypes} 
                selectedItems={selectedItems} 
                onChange={handleBadgeChange} 
            />
             <LoadRouteSelector
                origin={origin}
                destination={destination}
                onClear={handleClear}
                onSwapCities={handleSwapCities}
            />
            <View className='my-2'/>
            <LoadListCard
                originCity="Ташкент"
                originCountry="🇺🇿 Узбекистан"
                destinationCity="Денау"
                destinationCountry="🇺🇿 Узбекистан"
                weight="4т"
                cargoType="Тент"
                price="5 400 000"
                createdAt="13 минут назад"
                onBookmark={handleBookmark}
            />
        </ScrollView>
    )
}

export default SearchLoadScreen