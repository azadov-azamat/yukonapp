import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { ModalItemProps } from '@/interface/components';
import { Colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, TouchableOpacity, Text, ScrollView } from 'react-native';

const DynamicModal: React.FC<ModalItemProps> = ({ open, toggle, children }) => {
  return (
    <Modal
      animationType="fade" // Ochilish va yopilish animatsiyasi
      transparent={true} // Modalni orqa fon orqali ko'rish imkoniyati
      visible={open} // Modal ochiq yoki yopiq holatini boshqarish
      onRequestClose={toggle} // Back button bosilganda modalni yopish
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-[90%] max-h-[50vh] overflow-hidden p-6 bg-white rounded-lg">
        <TouchableOpacity onPress={toggle} className="absolute z-10 top-2 right-2">
            <View className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <Ionicons name="close" size={18} color={Colors.light.tint} /> 
            </View>
          </TouchableOpacity>
          <ScrollView showsHorizontalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DynamicModal;
