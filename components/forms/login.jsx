import React from 'react';
import { View, Alert } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/customs';

const LoginForm = () => {
  const formik = useFormik({
    initialValues: { phone: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      Alert.alert('Muvaffaqiyatli', `Telefon: ${values.phone}, Parol: ${values.password}`);
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
      />

      {/* Kirish tugmasi */}
      <CustomButton title="Kirish" onPress={formik.handleSubmit} buttonStyle={'bg-primary mt-2'} />

      {/* Parolni unutdingizmi */}
      <CustomButton title="Parolni unutdingizmi?" onPress={Working} />
      
    </View>
  );
};

export default LoginForm;
