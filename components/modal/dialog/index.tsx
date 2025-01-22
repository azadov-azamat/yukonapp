import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { ModalItemProps } from '@/interface/components';
import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

const DynamicModal: React.FC<ModalItemProps> = ({ open, toggle, children }) => {
  return (
    <Modal
      animationType="fade" // Ochilish va yopilish animatsiyasi
      transparent={true} // Modalni orqa fon orqali ko'rish imkoniyati
      visible={open} // Modal ochiq yoki yopiq holatini boshqarish
      onRequestClose={toggle} // Back button bosilganda modalni yopish
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-[90%] p-6 bg-white rounded-lg">
          {/* Close Button */}
          <TouchableOpacity onPress={toggle} className="absolute top-2 right-2">
            <TabBarIcon name='close' size={20}/>
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default DynamicModal;
