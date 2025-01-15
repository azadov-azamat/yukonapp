import { StyleSheet, ScrollView, View } from 'react-native'
import React from 'react'
import BadgeSelector from '@/components/customs/badge-selector'
import { OPTIONS } from '@/utils/constants'
import { CustomButton, CustomInput } from '@/components/customs'
import { TabBarIcon } from '@/components/navigation/tab-bar-icon'
import LoadRouteSelector from '@/components/load-route-selector'
import LoadListCard from '@/components/load-list-card'

const SearchLoadScreen = () => {
    
    const [searchText, setSearchText] = React.useState('');
    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    
    const handleBadgeChange = (id: string) => {
        setSelectedItems((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((itemId) => itemId !== id)
            : [...prevSelected, id] 
        );
    };
    
    const [origin, setOrigin] = React.useState('Ташкент');
    const [destination, setDestination] = React.useState('Любой');
  
    const handleSwapCities = () => {
      setOrigin((prevOrigin) => {
        const prevDestination = destination;
        setDestination(prevOrigin);
        return prevDestination;
      });
    };
  
    const handleClear = () => {
      setOrigin('');
      setDestination('');
    };
    
    const handleBookmark = () => {
        console.log('Bookmark clicked!');
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
                     onPress={()=> null}
                     
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