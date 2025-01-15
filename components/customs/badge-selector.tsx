import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BadgeSelectorProps, viewSelectorTabs } from '@/interface/components';

function FlatItem(
  {isSelected, item, onChange}: 
  {item: viewSelectorTabs, onChange: (value: string) => void, isSelected: (value: string) => boolean}
) {
  return (
    <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item.value)} // Callbackni chaqirish
            className={`px-4 py-2 rounded-full border ${
              isSelected(item.value)
                ? 'bg-primary border-primary'
                : 'bg-transparent border-primary'
            }`}
          >
            <View className="flex-row items-center">
              <Text
                className={`font-bold ${
                  isSelected(item.value) ? 'text-white' : 'text-primary'
                }`}
              >
                {item.label}
              </Text>
              {isSelected(item.value) && (
                <View className="absolute w-4 h-4 rounded-full bg-primary-red -top-4 -right-[19px]" />
              )}
            </View>
          </TouchableOpacity>
  )
}

const BadgeSelector: React.FC<BadgeSelectorProps> = ({ items, selectedItems, onChange, className }) => {
  const isSelected = (value: string) => selectedItems.includes(value); // Badge tanlanganligini tekshirish

  return (
    <View className={`flex w-full ${className}`}>
      <FlatList
        data={items} // Badge elementlari
        horizontal // Gorizontal scrollni yoqish
        showsHorizontalScrollIndicator={false} // Scroll indikatorini yashirish
        contentContainerStyle={{
          flexDirection: 'row',
          gap: 8,
          padding: 8,
          paddingLeft: 0,
          paddingRight: 0,
          alignContent: 'center'
        }}
        keyExtractor={(item) => item.value} // Har bir element uchun unikal kalit
        renderItem={({ item }) => (
          <FlatItem 
            item={item} 
            isSelected={isSelected} 
            onChange={onChange}
          />
        )}
      />
    </View>
  );
};

export default BadgeSelector;
