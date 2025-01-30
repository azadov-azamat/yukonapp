import React from 'react';
import { View, Alert, Text } from 'react-native';
import { useFormik } from 'formik';
import { paymentValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton, CustomOpenLink } from '@/components/customs';
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

const PaymentForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const { loading } = useAppSelector(state => state.auth)
  
  const formik = useFormik({
    initialValues: { cardNumber: '', expiry: '' },
    validationSchema: paymentValidationSchema,
    onSubmit: async (values) => {
      console.log(values);
      
    },
  });
  
  function extractNumbers(input: string) {
    return input.replace(/\D/g, '');
  }
  
  return (
    <View className="w-full">
      {/* Card number */}
      <CustomInput
        type='card'
        label={t ('payment-card.number')}
        value={formik.values.cardNumber}
        onChangeText={formik.handleChange('cardNumber')}
        onBlur={formik.handleBlur('cardNumber')}
        placeholder="0000 0000 0000 0000"
        keyboardType="numeric"
        error={formik.touched.cardNumber && formik.errors.cardNumber || null}
        divClass='mb-4'
        maxLength={19}
      />

      {/* Expiry */}
      <CustomInput
      type='expiry'
        label={t ('payment-card.expire')}
        value={formik.values.expiry}
        onChangeText={formik.handleChange('expiry')}
        onBlur={formik.handleBlur('expiry')}
        placeholder={t ('payment-card.month')}
        error={formik.touched.expiry && formik.errors.expiry || null}
        divClass='mb-4'
        keyboardType="numeric"
      />

      <Text className="text-xs text-gray-500">{t ('card-data-info')}</Text>
      
      <CustomButton 
        loading={loading}
        disabled={loading} 
        title={t ('payment-card.continue')} 
        onPress={formik.handleSubmit} 
        buttonStyle={'bg-primary mt-2'} 
      />
      
      <CustomOpenLink 
        url='https://cdn.payme.uz/terms/main.html?target=_blank' 
        hasIcon={false} text={'accept-terms'} textClass='text-xs mt-2'/>
    </View>
  );
};

export default PaymentForm;
