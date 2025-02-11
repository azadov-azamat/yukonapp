import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSubscriptions } from "@/redux/reducers/variable";
import { EmptyStateCard, SubscriptionCard } from "@/components/cards";
import { ContentSubscriptionLoader } from "@/components/content-loader";

export default function SubscriptionsPage() {
    const dispatch = useAppDispatch();
    const { subscriptions, loading } = useAppSelector(state => state.variable)
    const [refreshing, setRefreshing] = React.useState(false);
    
    const [status, setStatus] = React.useState('active'); 
  
    const tabs: viewSelectorTabs[] = [
        { label: 'active', value: 'active' },
        { label: 'expired', value: 'expired' },
    ];
  
    React.useEffect(()=> {
        dispatch(getSubscriptions({status}))
    }, [status])
  
    React.useEffect(()=> {
        return () => {
            dispatch({
                type: 'variable/getSubscriptions/fulfilled',
                payload: {
                    subscriptions: [],
                    pagination: null
                }
            })
        }
    }, [])
  
    const onRefresh = () => {
          setRefreshing(true);
          setTimeout(() => {
            dispatch(getSubscriptions({status}))
            setRefreshing(false); // Yangilashni tugatish
          }, 2000); // 2 soniyalik kechikish
      };
      
    return (
        <View className="items-center flex-1 px-4 pt-4 bg-white">
        <ViewSelector
            tabs={tabs}
            selectedTab={status}
            onTabSelect={(value: string) => setStatus(value)}
        />
        <View className="flex-1 w-full">
        {loading ? (
              <FlatList
              data={[1, 2, 3, 4]} // Foydalanilmaydigan placeholder massiv
              keyExtractor={(item) => item.toString()}
              renderItem={() => <ContentSubscriptionLoader />}
            />
            ) : ( <FlatList
                  data={subscriptions}
                  keyExtractor={(item) => item?.id?.toString()}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<EmptyStateCard type={"subscription-" + status}/>}
                  renderItem={({ item }) => <SubscriptionCard subscription={item}/>}
                  refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />)}
        </View>
        </View>
    );
}
