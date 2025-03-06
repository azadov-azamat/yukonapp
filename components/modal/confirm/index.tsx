import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DynamicModal from '../dialog';
import { ModalItemProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '@/components/custom';

interface ConfirmationModalProps extends ModalItemProps {
  onClick: (type: 'confirm' | 'deny') => void;
  text?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, toggle, text, onClick }) => {
  const { t } = useTranslation();
  
  return (
    <DynamicModal open={open} toggle={toggle}>
      <View className='mt-4'>
        <View className="text-center d-flex">
          <Text className='text-lg font-bold text-center text-primary-title-color dark:text-primary-light'>
            {text ? t (text) : t("alert.confirm-or-deny")}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <CustomButton
            title={t("confirm")}
            onPress={() => onClick('confirm')}
            buttonStyle='bg-primary'
          />
          <CustomButton
            title={t("deny")}
            onPress={() => onClick('deny')}
            buttonStyle='bg-primary-red'
          />
        </View>
      </View>
    </DynamicModal>
  )
}

export default ConfirmationModal

