import React from "react";
import { CustomInput } from "@/components/customs";
import { ScrollView, View, Text, FlatList } from "react-native";
import PopularDirections from "@/components/popular-directions";

export default function MainPage() {
  const [searchText, setSearchText] = React.useState('');
  
  const directions = [
    { from: 'Ташкент', to: 'Самарканд', totalAds: 143, todayAds: 29 },
    { from: 'Ташкент', to: 'Бухара', totalAds: 130, todayAds: 19 },
    { from: 'Ташкент', to: 'Наманган', totalAds: 256, todayAds: 28 },
    { from: 'Ташкент', to: 'Андижан', totalAds: 372, todayAds: 46 },
    { from: 'Ташкент', to: 'Фергана', totalAds: 98, todayAds: 10 },
  ];
  
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
       <View className="flex-row items-center justify-between w-full mb-6">
          <CustomInput
            value={searchText}
            onChangeText={(text: string) => setSearchText(text)} 
            placeholder="Yuk qidirish: Misol uchun: Towkentdan urganchga"
            divClass='w-full'
          />
       </View>
       <View className="">
          {/* Header */}
          <Text className="mb-4 text-lg font-bold text-center">
            5 самых популярных направлений поиска
          </Text>

          {/* Direction List */}
          <FlatList
            data={directions}
            keyExtractor={(item, index) => `${item.from}-${item.to}-${index}`}
            renderItem={({ item }) => <PopularDirections {...item}/>}
          />
      </View>
    </ScrollView>
  );
}
