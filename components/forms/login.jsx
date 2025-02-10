import React from 'react';
import { View, Alert } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/custom';
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
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
          Toast.show({
              type: 'success',
              text1: t ('success.login')
          });
          router.replace("/(tabs)");
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

  function Working() {
    // Alert.alert('Tugatilmagan', `Ishlash jarayonida`);
    router.push('/forgot-password')
  }
  
  return (
    <View className="w-4/5">
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

      {/* Kirish tugmasi */}
      <CustomButton 
        loading={loading}
        disabled={loading} 
        title={t ('login')} 
        onPress={formik.handleSubmit} 
        buttonStyle={'bg-primary mt-2'} 
      />

      {/* Parolni unutdingizmi */}
      <CustomButton title={t ("forgot-password")} onPress={Working} />
      
    </View>
  );
};

export default LoginForm;
