import React from "react";
import { CustomInput } from "@/components/customs";
import { ScrollView, View } from "react-native";

export default function MainPage() {
  const [searchText, setSearchText] = React.useState('');
  
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
    </ScrollView>
  );
}
