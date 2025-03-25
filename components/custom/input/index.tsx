import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ikonkalar uchun kutubxona
import { InputProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/config/ThemeContext';

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  type,
  divClass,
  loading = false,
  ...rest
}) => {
  const {t} = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Parolni ko'rsatish holati
  const { theme } = useTheme();
  function formatExpiryDate(value: string) {
    value = value.slice(0, 5);
    if (value.length === 2) {
      return value.slice(0, 2) + '/' + value.slice(2);
    }

    return value;
  }

  function formatCardNumber(value: string) {
    return value.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function updateValue(text: string) {
    let value = text;
    if (type === 'card') {
      value = formatCardNumber(value);
    } else if (type === 'expiry') {
      value = formatExpiryDate(value);
    }

    if (onChangeText) {
      onChangeText(value);
    }

    // event.target.value = value;
  }

  return (
    <View className={`relative ${divClass}`}>
      {/* Label */}
      {label && <Text className="mb-2 text-[15px] leading-[22.5px] font-semibold text-primary-title-color dark:text-primary-light">{label}</Text>}

      <View className={`flex-row items-center px-3 text-lg border bg-primary-bg-light dark:bg-primary-bg-dark rounded-2xl ${
            error ? 'border-primary-red' : 'border-transparent'
          }`}>
        {/* Telefon uchun prefix */}
        {type === 'phone' && (
          <Text className="mr-2 text-sm text-input-color">+998</Text>
        )}

        {/* Input */}
        <TextInput
          style={[styles.input]}
          className={`h-12 flex-1 focus-visible:outline-0 focus:outline-0 text-sm text-input-color`}
          value={value}
          onChangeText={updateValue}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputColor}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          keyboardType={type === 'phone' ? 'phone-pad' : 'default'}
          {...rest}
        />

        {loading && <ActivityIndicator size="small" color="gray" />}
      </View>

      {/* Error */}
      {error && <Text className="absolute -bottom-[18px] text-primary-red">{t (error)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {

    lineHeight: Platform.OS === 'ios' ? 17 : Platform.OS === 'web' ? 48 : undefined,
    textAlignVertical: Platform.OS === 'ios' ? 'center' : 'auto',

  }
});

export default Input;
