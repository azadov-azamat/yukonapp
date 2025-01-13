import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ikonkalar uchun kutubxona

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  onBlur, 
  placeholder, 
  error, 
  type,
  loading = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Parolni ko'rsatish holati

  return (
    <View className="relative mb-4">
      {/* Label */}
      {label && <Text className="mb-2 text-lg font-semibold">{label}</Text>}
      
      <View className="flex-row items-center px-3 py-1 text-lg bg-white border rounded-md border-border-color">
        {/* Telefon uchun prefix */}
        {type === 'phone' && (
          <Text className="mr-2 text-lg">+998</Text>
        )}
        
        {/* Input */}
        <TextInput
          style={{ flex: 1 }}
          className={`text-lg ${
            error ? 'border-primary-red' : 'border-border-color'
          }`}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          keyboardType={type === 'phone' ? 'phone-pad' : 'default'}
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
      {error && <Text className="absolute text-sm text-primary-red -bottom-4">{error}</Text>}
    </View>
  );
};

export default Input;
