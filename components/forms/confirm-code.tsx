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
import { getVerifyToken, verifyCard } from '@/redux/reducers/card';

const ConfirmCodeForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const { loading, card, verifyData } = useAppSelector(state => state.card)
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  
  const formik = useFormik({
    initialValues: {code: ''},
    onSubmit: async (values) => {
      console.log(values);
      dispatch(verifyCard({code: values.code, token: card ? card.token : ''}))
    },
  });

  React.useEffect(() => {
    if (verifyData) {
      startCountdown(verifyData.wait);
    }
  }, [verifyData]);
  
  const startCountdown = (second: number) => {
    setRemainingSeconds(second);
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  return (
    <View className="w-full">
      <Text className='mb-2 text-base'>{t ('payment-card.send-this-phone', {phone: verifyData?.phone})}</Text>
      {/* Confirm code */}
      <CustomInput
        label={t ('payment-card.enter-confirm-code')}
        value={formik.values.code}
        onChangeText={formik.handleChange('code')}
        onBlur={formik.handleBlur('code')}
        placeholder="0000"
        keyboardType="numeric"
        divClass='mb-4'
        maxLength={4}
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
        onPress={()=> dispatch(getVerifyToken({token: card?.token || ''}))} 
      />
      
      <Text>{t ('payment-card.time-left', {time: remainingSeconds})}</Text>
    </View>
  );
};

export default ConfirmCodeForm;
