import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { CustomInputSelector } from "@/components/custom";

const SearchVehicleScreen = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    // You can add validation here if needed
    if (!value) {
      setError('Please select an option');
    } else {
      setError('');
    }
  };

  const pickerItems = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Text>SearchVehicleScreen</Text>
      <View style={styles.container}>
        <Input
          label="Choose an option"
          value={selectedValue}
          onChangeText={handleValueChange}
          onBlur={() => console.log('Input blurred')}
          placeholder="Select an option"
          error={error}
          items={pickerItems}
          loading={false}
        />
      </View>
    </ScrollView>
  )
}

export default SearchVehicleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
