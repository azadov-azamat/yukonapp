import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { CustomInputSelector } from "@/components/custom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVehicleCountries, getVehicleCountryCities } from "@/redux/reducers/vehicle";
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getName } from '@/utils/general';
import { vehicleCountriesProps } from '@/interface/redux/variable.interface';

const SearchVehicleScreen = () => {
	const dispatch = useAppDispatch();
	const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const {activeCountries, activeCities, loading} = useAppSelector(state => state.vehicle);
	const [selectedCountry, setSelectedCountry] = React.useState<vehicleCountriesProps | null>(null); // Initialize with "" to avoid null
	const [selectedCity, setSelectedCity] = React.useState<vehicleCountriesProps | null>(null); // Initialize with "" to avoid null
  const [error, setError] = React.useState<string>("");

  const handleCountryChange = (item: any) => setSelectedCountry(item);
  const handleCityChange = (item: any) => setSelectedCity(item);

	React.useEffect(()=> {
    dispatch(getVehicleCountries())
  },  []);

  React.useEffect(() => {
    if (selectedCountry) {
      dispatch(getVehicleCountryCities(selectedCountry.id || 0))
    }  
  }, [selectedCountry])

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

  function onClear() {
    setSelectedCountry(null)
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
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
			</View>
    </ScrollView>
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
