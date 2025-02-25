import React from "react";
import { View, ImageBackground, StatusBar } from "react-native";
import ViewSelector from "@/components/view-selector";
import { viewSelectorTabs } from "@/interface/components";
import SearchLoadScreen from "./load.jsx";
import SearchVehicleScreen from "./vehicle";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "@/config/ThemeContext";

export default function SearchPage() {
  const [selectedTab, setSelectedTab] = React.useState('load');
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  
  const backgroundColor = isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(226,232,240,0.8)';

  React.useEffect(() => {
    StatusBar.setBackgroundColor(backgroundColor);

    return () => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    };
  }, [isDarkMode]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(backgroundColor);
      StatusBar.setTranslucent(true);

      return () => {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      };
    }, [isDarkMode])
  );
  
  const tabs: viewSelectorTabs[] = [
    { label: 'bookmarks.load', value: 'load', icon: 'cube' },
    { label: 'bookmarks.vehicle', value: 'vehicle', icon: 'car' },
  ];
  
  
  return (
    <SafeAreaProvider>
      <ImageBackground 
        source={require('@/assets/images/background.png')}
        style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}}>
          <View className="items-center flex-1 px-4 pt-4 bg-slate-200/80 dark:bg-primary-dark/70">
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
      </ImageBackground>
    </SafeAreaProvider>
  );
}
