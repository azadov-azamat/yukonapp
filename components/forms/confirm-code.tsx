import React from 'react';
import { View, Text } from 'react-native';
import { useFormik } from 'formik';
import { CustomInput, CustomButton } from '@/components/custom';
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import usePayment from '@/hooks/payment';

const ConfirmCodeForm = () => {
  const {t} = useTranslation();
  const {id} = useLocalSearchParams(); 
  const { loading, card, verifyData, receipt } = useAppSelector(state => state.card)
  const { verifyAndPay, resendVerificationCode, time, remainingSeconds } = usePayment();
  
  const formik = useFormik({
    initialValues: {code: ''},
    onSubmit: async (values) => {
      await verifyAndPay(values.code, id as string);
    },
  });

  return (
    <View className="w-full">
      <Text className='mb-2 text-base'>{t ('payment-card.send-this-phone', {phone: verifyData?.phone})}</Text>
      {/* Confirm code */}
      <CustomInput
        label={t ('payment-card.enter-confirm-code')}
        value={formik.values.code}
        onChangeText={formik.handleChange('code')}
        onBlur={formik.handleBlur('code')}
        placeholder="000000"
        keyboardType="numeric"
        divClass='mb-4'
        maxLength={6}
      />

      
      <CustomButton 
        loading={loading}
        disabled={loading} 
        title={t ('payment-card.confirm')} 
        onPress={formik.handleSubmit} 
        buttonStyle={'bg-primary my-2'} 
      />
       
      <CustomButton 
        disabled={loading} 
        title={t ('payment-card.resend-code')} 
        onPress={() => resendVerificationCode(card?.token as string)} 
      />
      
      <Text className='text-start mt-2 text-sm'>{t ('payment-card.time-left', {time: time(remainingSeconds)})}</Text>
    </View>
  );
};

export default ConfirmCodeForm;
