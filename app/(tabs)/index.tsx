import React from "react";
import { CustomInput } from "@/components/customs";
import { ScrollView, View, Text, FlatList } from "react-native";
import { PopularDirectionCard } from "@/components/cards";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from 'react-i18next';

export default function MainPage() {
  const { t } = useTranslation();
  const {topSearches} = useAppSelector(state => state.load);
  const [searchText, setSearchText] = React.useState('');
  
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
       <View className="flex-row items-center justify-between w-full mb-6">
          <CustomInput
            value={searchText}
            onChangeText={(text: string) => setSearchText(text)} 
            placeholder={t ('search-by-destination-main')}
            divClass='w-full'
          />
       </View>
       <View className="">
          {/* Header */}
          <Text className="mb-4 text-lg font-bold text-center">
            {t ("top-five-searches")}
          </Text>

          {/* Direction List */}
          <FlatList
            data={topSearches}
            keyExtractor={(item, index) => `${item.origin.id}-${item.destination.id}-${index}`}
            renderItem={({ item }) => <PopularDirectionCard {...item}/>}
          />
      </View>
    </ScrollView>
  );
}
