import React from 'react';
import { View, Text } from 'react-native';
import { useFormik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { paymentValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton, CustomOpenLink } from '@/components/custom';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import usePayment from '@/hooks/payment';

const PaymentForm = () => {
  const {t} = useTranslation();
  const { loading } = useAppSelector(state => state.card)
  const { createNewCard, resendVerificationCode } = usePayment();
  
  const extractNumbers = (input: string) => input.replace(/\D/g, '');
  
  const formik = useFormik({
    initialValues: { number: '', expire: '' },
    validationSchema: paymentValidationSchema,
    onSubmit: async (values) => {
      const token = await createNewCard(extractNumbers(values.number), extractNumbers(values.expire));
      if (token) {
        await resendVerificationCode(token);
      }
    },
  });
  
  React.useEffect(() => {
    return ()=> {
      formik.handleReset({ preventDefault: () => {} })
    }
  }, []);
  
  return (
    <View className="w-full">
      {/* Card number */}
      <CustomInput
        type='card'
        label={t ('payment-card.number')}
        value={formik.values.number}
        onChangeText={formik.handleChange('number')}
        onBlur={formik.handleBlur('number')}
        placeholder="0000 0000 0000 0000"
        keyboardType="numeric"
        error={formik.touched.number ? formik.errors.number : null}
        divClass='mb-4'
        maxLength={19}
      />

      {/* Expiry */}
      <CustomInput
        type='expiry'
        label={t ('payment-card.expire')}
        value={formik.values.expire}
        onChangeText={formik.handleChange('expire')}
        onBlur={formik.handleBlur('expire')}
        placeholder={t ('payment-card.month')}
        error={formik.touched.expire ? formik.errors.expire : null}
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
