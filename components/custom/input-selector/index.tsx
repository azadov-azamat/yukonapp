import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { InputSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getName } from '@/utils/general';

const Input: React.FC<InputSelectorProps<any>> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type,
  divClass,
  loading = false,
	items,
	valueField,
	labelField,
  clearValue,
  rightData,
  rowItem,
  disabled,
  ...rest
}) => {
  const {t} = useTranslation();

	const renderItem = (item: any, labelField: string) => {
    
    return (
      <View style={styles.item}>
        {rowItem(item)}
        {rightData && rightData(item)}
    </View>
    )
  };

	return (
		<Dropdown
			style={styles.dropdown}
			placeholderStyle={styles.placeholderStyle}
			selectedTextStyle={styles.selectedTextStyle}
			inputSearchStyle={styles.inputSearchStyle}
			iconStyle={styles.iconStyle}
			data={items}
			maxHeight={300}      
      disable={disabled}
			labelField={value && value[labelField] ? labelField : t ('payment-type.not_specified')}
			valueField={valueField}
			placeholder={t (placeholder)}
			// searchPlaceholder="Search..."
			// value={value}
			onChange={(item) => onChange(item)}
			containerStyle={styles.dropdownStyle}
			renderItem={(item) => renderItem(item, labelField)}
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
    borderRadius: 12,
    marginTop: 6,
  },
});
