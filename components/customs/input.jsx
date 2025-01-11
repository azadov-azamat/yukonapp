import React from 'react'
import { Text, View, TextInput } from 'react-native'

const CustomInput = ({ label, value, onChangeText, onBlur, placeholder, error, secureTextEntry }) => {
  return (
    <View className="mb-4">
      {/* Label */}
      {label && <Text className="text-lg font-semibold mb-2">{label}</Text>}
      
      {/* Input */}
      <TextInput
        className={`border rounded-md p-3 text-lg bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      
      {/* Error */}
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}

export default CustomInput