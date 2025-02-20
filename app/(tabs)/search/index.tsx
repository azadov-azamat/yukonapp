import React from "react";
import { View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import SearchLoadScreen from "./load.jsx";
import SearchVehicleScreen from "./vehicle";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchPage() {
  const [selectedTab, setSelectedTab] = React.useState('load');
  const insets = useSafeAreaInsets();
  
  const tabs: viewSelectorTabs[] = [
    { label: 'bookmarks.load', value: 'load', icon: 'cube' },
    { label: 'bookmarks.vehicle', value: 'vehicle', icon: 'car' },
  ];
  
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}}>
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
      </View>
    </SafeAreaProvider>
  );
}
