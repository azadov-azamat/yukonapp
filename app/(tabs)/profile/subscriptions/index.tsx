import React from "react";
import { View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";

export default function SubscriptionsPage() {
  const [selectedTab, setSelectedTab] = React.useState('active'); 
  
  const tabs: viewSelectorTabs[] = [
    { label: 'active', value: 'active' },
    { label: 'expired', value: 'expired' },
  ];
  
  
  return (
    <View className="items-center flex-1 px-4 pt-4 bg-gray-100">
      <ViewSelector
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={(value: string) => setSelectedTab(value)}
      />
       <View className="flex-1 w-full">
        
      </View>
    </View>
  );
}
