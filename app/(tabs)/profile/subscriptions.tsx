import React from "react";
import { FlatList, RefreshControl, ScrollView, View, Text, TouchableOpacity } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPlans, getSubscriptions } from "@/redux/reducers/variable";
import { EmptyStateCard, PlanCard, SubscriptionCard } from "@/components/cards";
import { ContentSubscriptionLoader } from "@/components/content-loader";
import { useTranslation } from "react-i18next";
import { getName } from "@/utils/general";
import { CustomButton, CustomOpenLink } from "@/components/custom";
import { useRouter } from "expo-router";
import { formatPrice } from "@/utils/general";


export default function SubscriptionsPage() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(); 
    const router = useRouter();
    const { subscriptions, loading, plans } = useAppSelector(state => state.variable)
    const [refreshing, setRefreshing] = React.useState(false);
    
    const [status, setStatus] = React.useState('active'); 
  
    const tabs: viewSelectorTabs[] = [
        { label: 'active', value: 'active' },
        { label: 'expired', value: 'expired' },
    ];
  
    React.useEffect(()=> {
        dispatch(getSubscriptions({status}))
    }, [status])
  
    React.useEffect(() => {
        dispatch(getPlans());
    }, []);
    
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
        <View className="items-center flex-1 px-4 pt-4 bg-white dark:bg-black">
            <ViewSelector
                tabs={tabs}
                selectedTab={status}
                onTabSelect={(value: string) => setStatus(value)}
            />
            <View className="w-full ">
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
                        ListEmptyComponent={<EmptyStateCard type={`subscription-${status}`} />}
                        renderItem={({ item }) => <SubscriptionCard subscription={item} />}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                )}
            </View>
            <FlatList
                data={plans}
                className="my-3"
                keyExtractor={(plan) => plan.id.toString()}
                ItemSeparatorComponent={() => <View className="h-4" />}
                renderItem={({ item: plan }) => <PlanCard {...plan}/>}
            />
            <View className="items-center w-full mb-2">
                <CustomOpenLink url='https://t.me/marina_laty' hasIcon={false} text={t ('ask-to-support')}/>
            </View>
        </View>
    );
}
