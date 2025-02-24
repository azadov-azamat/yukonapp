import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateFromNow, formatPrice, getCityCountryName, getCityName } from '@/utils/general';
import LoadModel from '@/models/load';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadCardInterfaceProps, vehicleCardInterfaceProps } from '@/interface/components';
import { getCityByIds } from '@/redux/reducers/city';
import CityModel from '@/models/city';

const VehicleCard = ({vehicle, onPress, showElement = false, showIcon = false }: vehicleCardInterfaceProps) => {
	const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
	const { vehicleCities } = useAppSelector(state => state.city);
  const {t} = useTranslation();

	// Memoize destinationCityIds to prevent unnecessary recalculations
  const destinationCityIds = React.useMemo(() =>
    vehicle.destinationCityIds?.length ? vehicle.destinationCityIds.join(',') : '',
    [vehicle.destinationCityIds]
  );

  // Memoize the cities check
  const shouldFetchCities = React.useMemo(() => {
    const hasVehicleId = Boolean(vehicle.id);
    const citiesNotLoaded = !vehicleCities[vehicle.id || 0];
    const hasDestinationIds = Boolean(destinationCityIds);
    const notAlreadyFetching = !vehicle.loading; // Add loading state to prevent duplicate requests

    return hasVehicleId && citiesNotLoaded && hasDestinationIds && notAlreadyFetching;
  }, [vehicle.id, vehicleCities, destinationCityIds, vehicle.loading]);

  // Single useEffect for city fetching
  React.useEffect(() => {
    let isMounted = true;

    const fetchCities = async () => {
      if (shouldFetchCities && isMounted) {
        try {
          await dispatch(getCityByIds({
            ids: destinationCityIds,
            vehicleId: String(vehicle.id)
          }));
        } catch (error) {
          console.error('Failed to fetch cities:', error);
        }
      }
    };

    fetchCities();

    return () => {
      isMounted = false;
    };
  }, [shouldFetchCities, destinationCityIds, vehicle.id]);

  // Remove the console.log that might trigger re-renders
  const cities = React.useMemo(() =>
    vehicleCities[vehicle.id || 1],
    [vehicle.id, vehicleCities]
  );

  const ParentComponent = showElement ? View : TouchableOpacity;

  return (
    <ParentComponent
    {...(!showElement && { onPress })}
    className="flex-col items-start justify-between p-4 mb-4 bg-white border-t border-gray-200 relative">
    {/* Left Side: Origin and Destination */}
		{showIcon && (
			<View className='absolute top-0 right-0 mx-2 my-2'>
				<Ionicons name="car" size={18} color="#2563eb" />
			</View>
		)}
    <View className="flex-1">
      <Text className="flex text-lg font-bold text-gray-800">
				{getCityCountryName(vehicle, 'origin')}
				<Ionicons name="chevron-forward" size={18} color="gray" />
			</Text>

			<View className="flex-row flex-1">
				{cities?.map((city: CityModel, index: number) => (
					<Text key={city.id} className="text-md text-purple-800">
						{getCityName(city)}{index !== (cities.length - 1) ? ', ' : ''}
					</Text>
				))}
			</View>
		</View>

    <View className="flex-row items-center justify-between flex-1 w-full mt-3">
    	<View className="flex-row items-center">
        <Text className="text-sm text-gray-600">{t ('truck-type.' + vehicle.truckType)}</Text>
        <TouchableOpacity className="ml-2">
          <Text className="font-bold text-blue-600">{t (vehicle.isWebAd ? 'site' : 'telegram')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end">
      <Text className="text-sm text-gray-600">{dateFromNow(vehicle.publishedDate || vehicle.createdAt || '')}</Text>
    </View>
    </View>
  </ParentComponent>
  );
};

export default VehicleCard;
