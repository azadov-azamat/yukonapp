import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/custom';
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

const Login = ({setView}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const { loading } = useAppSelector(state => state.auth)
  
  const formik = useFormik({
    initialValues: { phone: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      dispatch(login(values))
        .then(unwrapResult)
        .then(res => {
          router.replace("/(tabs)");
          Toast.show({
              type: 'success',
              text1: t ('success.login')
          });
        })
        .catch(err => {
          switch(err.status) {
            case 400:
              Toast.show({
                type: 'error',
                text1: t ('errors.auth'),
              });
              break;
          }
        }) 
    },
  });

  function handleForgotPassword() {
    setView('forgot-password')
  }
  
  function handleContinueWithTelegram() {
    Alert.alert('Coming soon')
  }

  return (
    <StyledView>
      {/* Telefon raqami */}
      <CustomInput
        type={'phone'}
        label={t ('phone')}
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        placeholder="90 123 45 67"
        error={formik.touched.phone && formik.errors.phone}
        divClass='mb-4'
      />

      {/* Parol */}
      <CustomInput
        label={t ('password')}
        type={'password'}
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        placeholder={t ('password')}
        error={formik.touched.password && formik.errors.password}
        divClass='mb-4'
      />
      
      <StyledView className="items-end mb-4"> 
            <StyledTouchableOpacity
              onPress={handleForgotPassword}
            >
              <StyledText className={`text-[15px] leading-[22.5px] font-semibold text-primary`}>{t ("forgot-password")}</StyledText>
            </StyledTouchableOpacity>
      </StyledView>
      
      {/* Kirish tugmasi */}
      <CustomButton 
        loading={loading}
        disabled={loading} 
        title={t ('login')} 
        onPress={formik.handleSubmit} 
        buttonStyle={'bg-primary mt-2'} 
      />
      
      <StyledView className="flex-row items-center justify-center my-8 space-x-4">
        <View className="h-[1px] flex-1 bg-border-color" />
        <StyledText className={`text-[15px] leading-[22.5px] font-semibold text-text-color`}>{t('or')}</StyledText>
        <View className="h-[1px] flex-1 bg-border-color" />
      </StyledView>
      
      <CustomButton 
        title={t ('auth-with-telegram')} 
        onPress={handleContinueWithTelegram} 
        buttonStyle={'bg-primary-bg-light dark:bg-primary-bg-dark'}
        textStyle={'text-primary-title-color dark:text-primary-light'}    
      />
      
    </StyledView>
  );
};

export default Login;
