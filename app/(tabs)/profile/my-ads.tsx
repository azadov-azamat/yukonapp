import React from "react";
import { FlatList, Platform, RefreshControl, View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	clearLoads,
	getLoadById,
	searchLoads,
	setLoad,
} from '@/redux/reducers/load';
import {
clearVehicles,
	getVehicleCountries,
	getVehicleCountryCities,
	searchVehicles,
	setVehicle,
} from '@/redux/reducers/vehicle';
import { EmptyStateCard } from "@/components/cards";
import { ContentLoaderLoadList } from "@/components/content-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadListCard, VehicleListCard } from '@/components/cards'
import { useBottomSheet } from '@/hooks/context/bottom-sheet';
import { useRouter } from "expo-router";

export default function MyAdsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {loads, loading: cargoLoad} = useAppSelector(state => state.load);
	const {vehicles, loading: vehicleLoad} = useAppSelector(state => state.vehicle);
  const [refreshing, setRefreshing] = React.useState(false);
  const [combinedData, setCombinedData] = React.useState<any[]>([]);

	const { openEditForm } = useBottomSheet();

  async function getLocalstorageData() {
    try {
      const authData = await AsyncStorage.getItem('authenticate');
      if (authData) {
        const { userId } = JSON.parse(authData);
        return userId;
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
    return null;
  }

  const params = {
    sort: '!createdAt',
    isDeleted: false,
  }

  React.useEffect(() => {
    const fetchData = async () => {
      dispatch(clearLoads());
      const owner_id = await getLocalstorageData();
      const loadsResponse = await dispatch(searchLoads({ ...params, owner_id })) as { payload: { loads: any[] } };
      const vehiclesResponse = await dispatch(searchVehicles({ ...params, owner_id })) as { payload: { vehicles: any[] } };

      // Combine and sort loads and vehicles
      const combined = [
        ...loadsResponse.payload.loads,
        ...(vehiclesResponse.payload.vehicles || []), // Ensure vehicles is iterable
      ];
      const sortedCombined = combined
        .filter(item => item.createdAt) // Filter out items without createdAt
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      setCombinedData(sortedCombined);
    };
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(clearLoads());
      dispatch(searchLoads(params));
      setRefreshing(false);
    }, 2000);
  };

  const loadPreview = (item: any) => {
    if (Platform.OS === 'android') {
      router.push('/android/ads/' + item.id);
    } else {  
      openEditForm(item.id, item.cargoType ? 'load' : 'vehicle');
    }
  }

  return (
    <View className="items-center flex-1 pt-4 bg-white dark:bg-black">
      <View className="flex-1 w-full">
          {cargoLoad || vehicleLoad ? (
              <FlatList
                  data={[1, 2, 3, 4]}
                  keyExtractor={(item) => item.toString()}
                  renderItem={() => <ContentLoaderLoadList />}
              />
          ) : (
              <FlatList
                  data={combinedData}
                  keyExtractor={(item: any) => item?.id?.toString()}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<EmptyStateCard type="load" />}
                  renderItem={({ item }) => item.cargoType ? <LoadListCard onPress={() => loadPreview(item)} load={item} showIcon={true} /> : <VehicleListCard onPress={() => loadPreview(item)} vehicle={item} showIcon={true} />}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
          )}
      </View>
    </View>
  );
}
