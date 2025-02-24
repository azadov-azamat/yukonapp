import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearLoad, clearLoads, getLoadById, searchLoads, setLoad } from '@/redux/reducers/load'
import { EmptyStateCard, SubscriptionCard } from "@/components/cards";
import { ContentSubscriptionLoader } from "@/components/content-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyAdsPage() {
  const dispatch = useAppDispatch();
  const { subscriptions, loading } = useAppSelector(state => state.variable)
  const [refreshing, setRefreshing] = React.useState(false);

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

  React.useEffect(async ()=> {
    const owner_id = await getLocalstorageData();
    dispatch(searchLoads({ ...params, owner_id }));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(searchLoads(params));
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View className="items-center flex-1 px-4 pt-4 bg-white dark:bg-black">
      <View className="flex-1 w-full">
          {loading ? (
              <FlatList
                  data={[1, 2, 3, 4]}
                  keyExtractor={(item) => item.toString()}
                  renderItem={() => <ContentSubscriptionLoader />}
              />
          ) : (
              <FlatList
                  data={subscriptions}
                  keyExtractor={(item) => item?.id?.toString()}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<EmptyStateCard type="load" />}
                  renderItem={({ item }) => <SubscriptionCard subscription={item} />}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
          )}
      </View>
    </View>
  );
}
