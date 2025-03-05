import React from "react";
import { View } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import BookmarksLoadScreen from "./load";
import BookmarksVehicleScreen from "./vehicle";

export default function BookmarksPage() {
  const [selectedTab, setSelectedTab] = React.useState('load'); 
  
  const tabs: viewSelectorTabs[] = [
    { label: 'bookmarks.load', value: 'load', icon: 'cube' },
    { label: 'bookmarks.vehicle', value: 'vehicle', icon: 'car' },
  ];
  
  
  return (
    <View className="items-center flex-1 px-4 pt-4 bg-primary-light/20 dark:bg-primary-dark/20">
      <ViewSelector
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelect={(value: string) => setSelectedTab(value)}
      />
       <View className="flex-1 w-full">
        {selectedTab === 'load' && <BookmarksLoadScreen />}
        {selectedTab === 'vehicle' && <BookmarksVehicleScreen />}
      </View>
    </View>
  );
}
