import React from 'react';
import { View } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/custom';
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createUser, login, sendSmsCode, uniquePhone } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import UserModel from '@/models/user';

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading, uniquePhoneExists, successSendSms } = useAppSelector(state => state.auth);
  
  const [phone, setPhone] = React.useState('');
  const [isSmsSent, setIsSmsSent] = React.useState(false);
  const [isVerifyPhone, setIsVerifyPhone] = React.useState(false);
  const [smsCode, setSmsCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const checkPhoneNumber = async (phone: string) => {
    const response = await dispatch(uniquePhone({ phone: phone }));
    if (response.payload?.exist) {
      Toast.show({
        type: 'error',
        text1: t('errors.phone-exist'),
      });
    } else {
      setIsVerifyPhone(true);
    }
  };

  const debouncedCheckPhoneNumber = React.useCallback(debounce(checkPhoneNumber, 400), []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!password) {
      newErrors.password = t('errors.enter-required');
    } else if (password.length < 6) {
      newErrors.password = t('errors.password-too-short');
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = t('errors.password-not-match');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const user = new UserModel({
        phone: phone,
        password: password,
        smsToken: smsCode,
        isAgreed: true,
      });
      dispatch(createUser(user)).then(unwrapResult).then((res) => {
        router.push('/auth');
        Toast.show({
          type: 'success',
          text1: t('success.register'),
        }); 
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const sendCode = () => {
    dispatch(sendSmsCode({ phone: phone, action: 'register' }));
  };
  
  return (  
    <View className="w-4/5">
      {/* Telefon raqami */}
      <CustomInput
        type={'phone'}
        label={t('phone')}
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          debouncedCheckPhoneNumber(text);
        }}
        placeholder="90 123 45 67"
        divClass='mb-4'
      />

      {
         successSendSms && (<CustomInput
         label={t('enter-code')}
         value={smsCode}
         maxLength={4}
         onChangeText={setSmsCode}
         placeholder="****"
         divClass='mb-4'
        />
        )
      }           
      {/* Sms jo'natish tugmasi */}
      <CustomButton
        disabled={!isVerifyPhone}
        title={successSendSms ? t('send-code-again') : t('send-verification')}
        onPress={sendCode}
        buttonStyle={'bg-primary mt-2'}
      />
 

      {/* Parol */}
      {
        successSendSms && smsCode.length === 4 && (
          <>
          <CustomInput
            label={t('password')}
            type={'password'}
            value={password}
            onChangeText={setPassword}
            placeholder="******"
            error={errors.password}
            divClass='mb-4 mt-4'
          />
          <CustomInput
            label={t('confirm')}
            type={'password'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="******"
            error={errors.confirmPassword}
            divClass='mb-4'
          />
           <CustomButton
            loading={loading}
            disabled={loading}
            title={t('register')}
            onPress={handleSubmit}
            buttonStyle={'bg-primary mt-2'}
          />
          </>
        )
      }
    </View>
  );
};

export default RegisterForm;
