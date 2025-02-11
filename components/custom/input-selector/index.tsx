import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { InputSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';

const data = [
	{ label: 'Item 1', value: '1' },
	{ label: 'Item 2', value: '2' },
	{ label: 'Item 3', value: '3' },
	{ label: 'Item 4', value: '4' },
	{ label: 'Item 5', value: '5' },
	{ label: 'Item 6', value: '6' },
	{ label: 'Item 7', value: '7' },
	{ label: 'Item 8', value: '8' },
];

const Input: React.FC<InputSelectorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type,
  divClass,
  loading = false,
  ...rest
}) => {
  const {t} = useTranslation();

	const renderItem = (item: { label: string, value: string }) => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
      {item.value === value && (
        <AntDesign
          style={styles.icon}
          color="black"
          name="Safety"
          size={20}
        />
      )}
    </View>
  );

	return (
		<Dropdown
			style={styles.dropdown}
			placeholderStyle={styles.placeholderStyle}
			selectedTextStyle={styles.selectedTextStyle}
			inputSearchStyle={styles.inputSearchStyle}
			iconStyle={styles.iconStyle}
			data={data}
			search
			maxHeight={300}
			labelField="label"
			valueField="value"
			placeholder="Select item"
			searchPlaceholder="Search..."
			value={value}
			onChange={onChange}
			containerStyle={styles.dropdownStyle}
			// renderLeftIcon={() => (
			// 	<AntDesign style={styles.icon} color="black" name="Safety" size={20} />
			// )}
			renderItem={renderItem}
			{...rest}
		/>
	);
};

export default Input;

const styles = StyleSheet.create({
	dropdown: {
		// margin: 16,
		paddingTop: 12,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 12,
		height: 52,
		borderColor: '#ced4da',
		borderWidth: 1,
		backgroundColor: 'white',
		borderRadius: 12,
		// shadowColor: '#000',
		// shadowOffset: {
		// 	width: 0,
		// 	height: 1,
		// },
		// shadowOpacity: 0.2,
		// shadowRadius: 1.41,
		// elevation: 2,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
	dropdownStyle: {
    borderRadius: 12, // Curved border radius for the dropdown list
    marginTop: 8, // Add margin between input and dropdown
  },
});
