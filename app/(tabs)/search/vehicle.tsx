import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { CustomInputSelector } from "@/components/custom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVehicleCountries } from "@/redux/reducers/vehicle";
import { useTranslation } from 'react-i18next';

const SearchVehicleScreen = () => {
	const dispatch = useAppDispatch();
	// const { t } = useTranslation();
  const {countries, loading} = useAppSelector(state => state.vehicle);
	const [selectedValue, setSelectedValue] = useState<string>(""); // Initialize with "" to avoid null
  const [error, setError] = useState<string>("");

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    // You can add validation here if needed
    if (!value) {
      setError('Please select an option');
    } else {
      setError('');
    }
  };

	React.useEffect(()=> {
    dispatch(getVehicleCountries())
  },  []);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View style={styles.container}>
				<CustomInputSelector
					label="Choose an option"
					value={selectedValue}
					onChange={handleValueChange}
					placeholder="Select an option"
					error={error}
					loading={loading}
					items={countries}
					labelField="name_uz"
          valueField="name_uz"
					search={false}
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
    // padding: 20,
  },
});
