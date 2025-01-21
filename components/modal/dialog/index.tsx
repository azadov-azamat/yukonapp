import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

interface DynamicModalProps {
  open: boolean;
  toggle: () => void;
  children?: React.ReactNode;
}

const DynamicModal: React.FC<DynamicModalProps> = ({ open, toggle, children }) => {
  return (
    <Modal
      animationType="fade" // Ochilish va yopilish animatsiyasi
      transparent={true} // Modalni orqa fon orqali ko'rish imkoniyati
      visible={open} // Modal ochiq yoki yopiq holatini boshqarish
      onRequestClose={toggle} // Back button bosilganda modalni yopish
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-4/5 p-6 bg-white rounded-lg">
          {/* Close Button */}
          <TouchableOpacity onPress={toggle} className="absolute top-2 right-2">
            <Text className="text-xl font-bold">×</Text>
          </TouchableOpacity>

          {/* Children */}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default DynamicModal;
