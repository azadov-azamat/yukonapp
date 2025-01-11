import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import CustomInput from '@/components/customs/input';

const LoginForm = () => {
  const formik = useFormik({
    initialValues: { phone: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      Alert.alert('Muvaffaqiyatli', `Telefon: ${values.phone}, Parol: ${values.password}`);
    },
  });

  return (
    <View className="w-4/5">
      {/* Telefon raqami */}
      <CustomInput
        label="Telefon raqami"
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        placeholder="+998901234567"
        error={formik.touched.phone && formik.errors.phone}
      />

      {/* Parol */}
      <CustomInput
        label="Parol"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        placeholder="Parol"
        secureTextEntry
        error={formik.touched.password && formik.errors.password}
      />

      {/* Kirish tugmasi */}
      <TouchableOpacity
        onPress={formik.handleSubmit}
        className="bg-purple-600 rounded-md p-3 mt-3"
      >
        <Text className="text-white text-center text-lg">Kirish</Text>
      </TouchableOpacity>

      {/* Parolni unutdingizmi */}
      <TouchableOpacity
        onPress={() => Alert.alert('Parolni tiklash')}
        className="mt-3"
      >
        <Text className="text-gray-500 text-center">Parolni unutdingizmi?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
