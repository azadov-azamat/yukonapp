import React from 'react';
import { View, Text, StyleSheet, TextInput, ViewStyle, TextStyle } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { InputSelectorProps } from '@/interface/components';

const Input: React.FC<InputSelectorProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder = 'Select an option',
  error,
  type,
  divClass,
  loading = false,
  items,
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      {/* RNPickerSelect for selecting options */}
      <RNPickerSelect
        value={value}
        onValueChange={(newValue) => onChangeText(newValue)}
        items={items}
        placeholder={{ label: placeholder, value: null }}
        onDonePress={onBlur}
        style={{
          inputIOS: [styles.input, inputStyle], // Custom styles for iOS
          inputAndroid: [styles.input, inputStyle], // Custom styles for Android
        }}
      />

      {error && <Text style={styles.error}>{error}</Text>} {/* Display error message */}

      {loading && <Text>Loading...</Text>} {/* Show loading state */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default Input;
