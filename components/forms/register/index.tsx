import React from 'react';
import { View, Text, Linking } from 'react-native';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/validations/form';
import { CustomInput, CustomButton } from '@/components/custom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createUser, login, sendSmsCode, uniquePhone } from '@/redux/reducers/auth';
import Toast from 'react-native-toast-message';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import UserModel from '@/models/user';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '@/config/ThemeContext';

const Register = ({setView}: {setView: (view: string) => void}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading, uniquePhoneExists, successSendSms } = useAppSelector(state => state.auth);
  const { theme } = useTheme();
  
  const [phone, setPhone] = React.useState('');
  const [isVerifyPhone, setIsVerifyPhone] = React.useState(true);
  const [smsCode, setSmsCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);

  const checkPhoneNumber = async (phone: string) => {
    const response = await dispatch(uniquePhone({ phone: phone }));
    if (response.payload?.exist) {
      Toast.show({
        type: 'error',
        text1: t('errors.phone-exist'),
      });
      setIsVerifyPhone(true);
    } else {
      setIsVerifyPhone(false);
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
    if (validate() && isAgreed) {
      const user = new UserModel({
        phone: phone,
        password: password,
        smsToken: smsCode,
        isAgreed: true,
      });
      dispatch(createUser(user)).then(unwrapResult).then((res) => {
        Toast.show({
          type: 'success',
          text1: t('success.create'),
          text2: t('success.register'),
        }); 
        setView('login');
      }).catch((err) => {
        console.log(err);
        Toast.show({
          type: 'error',
          text1: t('errors.something-wrong'),
        });
      });
    }
  };

  const sendCode = () => {
    dispatch(sendSmsCode({ phone: phone, action: 'register' })).then(unwrapResult).then((res) => {
      Toast.show({
        type: 'success',
        text1: t('code-sent'),
      });
      setCurrentStep(2);
    }).catch((err) => {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: t('errors.something-wrong'),
      });
      setCurrentStep(1);
    });
  };

  const handleNextStep = async () => {
    const stepActions: Record<number, () => Promise<void> | void> = {
      1: () => sendCode(),
      2: () => setCurrentStep(3),
      3: async () => {
        await handleSubmit();
      },
    };

    const action = stepActions[currentStep];
    if (action) {
      await action();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View>
      {/* Step 1: Phone Input */}
      {currentStep === 1 && (
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
      )}

      {/* Step 2: SMS Code Input */}
      {currentStep === 2 && successSendSms && (
        <CustomInput
          label={t('enter-code')}
          value={smsCode}
          maxLength={4}
          onChangeText={setSmsCode}
          placeholder="****"
          divClass='mb-4'
        />
      )}

      {/* Step 3: Password Inputs */}
      {currentStep === 3 && successSendSms && smsCode.length === 4 && (
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
          <View className='flex-row items-start mt-2'>
            <Checkbox
              status={isAgreed ? 'checked' : 'unchecked'}
              onPress={() => setIsAgreed(!isAgreed)}
              uncheckedColor={theme.colors.primary}
            />
            <Text className='mt-1 text-sm leading-6 text-text-color' onPress={() => {
              setIsAgreed(!isAgreed);
            }}>
              {t ('terms-of-use')}{' '}
              <Text className='text-sm leading-6 text-primary' onPress={() => Linking.openURL('https://drive.google.com/file/d/1XZx_fxz7ciU6vhM5knd5XTMb7TRKJqPn/view?pli=1')}>
                {t ('terms-of-use-link')}
              </Text>
            </Text>
          </View>
        </>
      )}

      {/* Navigation Buttons */}
      <View className='flex-row justify-between mt-4'>
        {currentStep > 1 && (
          <CustomButton
            title={t('go-back')}
            onPress={handlePreviousStep}
            buttonStyle={'flex-1 bg-secondary mr-2'}
            disabled={loading}
          />
        )}
        <CustomButton
          loading={loading}
          title={
            currentStep === 1
              ? t('send-verification')
              : currentStep === 2
              ? t('confirm')
              : t('complete')
          }
          onPress={handleNextStep}
          disabled={
            (currentStep === 1 && (!phone || isVerifyPhone)) ||
            (currentStep === 2 && !smsCode) ||
            (currentStep === 3 && (!password || !confirmPassword || !isAgreed))
          }
          buttonStyle='flex-1 bg-primary'
        />
      </View>
    </View>
  );
};

export default Register;
