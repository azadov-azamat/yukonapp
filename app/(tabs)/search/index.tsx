import React from "react";
import { View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import SearchLoadScreen from "./load.jsx";
import SearchVehicleScreen from "./vehicle";
import { SubscriptionModal } from "@/components/modal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserSubscriptionModal } from "@/redux/reducers/auth";

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
  
export default function SearchPage() {
  const dispatch  = useAppDispatch();
  const {user} = useAppSelector(state => state.auth)
  const [selectedTab, setSelectedTab] = React.useState('load'); 
    
  useIsomorphicLayoutEffect(()=> {    
    if (user?.isSubscriptionModal) {
      console.log("user?.isSubscriptionModal if user", user?.isSubscriptionModal);
    }
  }, [user?.isSubscriptionModal]);
  
  const tabs: viewSelectorTabs[] = [
    { label: 'bookmarks.load', value: 'load', icon: 'cube' },
    { label: 'bookmarks.vehicle', value: 'vehicle', icon: 'car' },
  ];
  
  
  return (
    <View className="items-center flex-1 px-4 pt-4 bg-gray-100">
      <ViewSelector
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={(value: string) => setSelectedTab(value)}
      />
       <View className="flex-1 w-full">
        {selectedTab === 'load' && <SearchLoadScreen />}
        {selectedTab === 'vehicle' && <SearchVehicleScreen />}
      </View>
    </View>
  );
}
