import React from "react";
import { View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import SearchLoadScreen from "./load";
import SearchVehicleScreen from "./vehicle";

export default function SearchPage() {
  const [selectedTab, setSelectedTab] = React.useState('load'); // Default tab
  const [searchText, setSearchText] = React.useState('');

  const tabs: viewSelectorTabs[] = [
    { label: 'Yuk', value: 'load', icon: 'cube' },
    { label: 'transport', value: 'vehicle', icon: 'car' },
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
