import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ikonkalar uchun kutubxona
import { InputProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';

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
    <View style={[styles.container]} className={`relative ${divClass}`}>
      {/* Label */}
      {label && <Text className="mb-1 text-lg font-semibold">{label}</Text>}
      
      <View className="flex-row items-center px-3 text-lg bg-white border rounded-md border-border-color">
        {/* Telefon uchun prefix */}
        {type === 'phone' && (
          <Text className="mr-2 text-lg">+998</Text>
        )}
        
        {/* Input */}
        <TextInput
          style={[styles.input]}
          className={`text-lg h-12 flex-1 ${
            error ? 'border-primary-red' : 'border-border-color'
          }`}
          value={value}
          onChangeText={updateValue}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          keyboardType={type === 'phone' ? 'phone-pad' : 'default'}
          {...rest}
        />
        
        {/* Parol uchun ko'rish/ko'rmaslik icon */}
        {type === 'password' && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={24}
              color={'gray'}
            />
          </TouchableOpacity>
        )}

        {loading && <ActivityIndicator size="small" color="gray" />}
      </View>
      
      {/* Error */}
      {error && <Text className="absolute -bottom-[18px] text-primary-red">{t (error)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    lineHeight: Platform.OS === 'ios' ? 21.5 : Platform.OS === 'web' ? 48 : null,
    textAlignVertical: Platform.OS === 'ios' ? 'center' : null,
    outlineStyle: 'none',
  },
  container: {
    zIndex: null
  }
});

export default Input;
