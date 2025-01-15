import React from 'react';
import { View, Alert } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/customs';
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth)
  
  const formik = useFormik({
    initialValues: { phone: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const res = await dispatch(login(values));
      
      const status = res.payload?.status;
      if (status === 400) {
        return Toast.show({
          type: 'error',
          text1: 'Login xato!',
          text2: 'Login va parolni kiriting.',
        });
      } else if (status === 500) {
        return Toast.show({
          type: 'error',
          text1: 'Tizimda nosozlik!',
          text2: 'Keyinroq urinib ko\'ring',
        });
      }
      
      Toast.show({
          type: 'success',
          text1: 'Xush kelibsiz!',
          text2: 'Siz muvaffaqiyatli tizimga kirdingiz.',
      });
      router.push("/(tabs)");
      
    },
  });

  function Working() {
    Alert.alert('Tugatilmagan', `Ishlash jarayonida`);
  }
  
  return (
    <View className="w-4/5">
      {/* Telefon raqami */}
      <CustomInput
        type={'phone'}
        label="Telefon raqami"
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        placeholder="90 123 45 67"
        error={formik.touched.phone && formik.errors.phone}
        divClass='mb-4'
      />

      {/* Parol */}
      <CustomInput
        label="Parol"
        type={'password'}
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        placeholder="Parol"
        error={formik.touched.password && formik.errors.password}
        divClass='mb-4'
      />

      {/* Kirish tugmasi */}
      <CustomButton 
        loading={loading}
        disabled={loading} 
        title="Kirish" 
        onPress={formik.handleSubmit} 
        buttonStyle={'bg-primary mt-2'} 
      />

      {/* Parolni unutdingizmi */}
      <CustomButton title="Parolni unutdingizmi?" onPress={Working} />
      
    </View>
  );
};

export default LoginForm;
