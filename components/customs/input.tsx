import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ikonkalar uchun kutubxona
import { InputProps } from '@/interface/components';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Parolni ko'rsatish holati

  return (
    <View className={`relative ${divClass}`}>
      {/* Label */}
      {label && <Text className="mb-1 text-lg font-semibold">{label}</Text>}
      
      <View className="flex-row items-center px-3 text-lg bg-white border rounded-md border-border-color">
        {/* Telefon uchun prefix */}
        {type === 'phone' && (
          <Text className="mr-2 text-lg">+998</Text>
        )}
        
        {/* Input */}
        <TextInput
          style={{
            outline: 'none'
          }}
          className={`text-lg h-12 flex-1 ${
            error ? 'border-primary-red' : 'border-border-color'
          }`}
          value={value}
          onChangeText={onChangeText}
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
      {error && <Text className="absolute text-sm text-primary-red -bottom-[18px]">{error}</Text>}
    </View>
  );
};

export default Input;
