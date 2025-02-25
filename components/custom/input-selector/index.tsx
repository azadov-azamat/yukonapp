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
  onSearch,
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
  search,
  ...rest
}) => {
  const {t} = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

	const filteredData = items
		? search
			? onSearch
				? onSearch(searchQuery, items)
				: items
			: items
		: [];

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
			iconStyle={styles.iconStyle}
			data={filteredData}
			maxHeight={300}      
      disable={disabled}
			labelField={value && value[labelField] ? labelField : t ('payment-type.not_specified')}
			labelField={labelField}
			valueField={valueField}
			placeholder={t (placeholder)}
			searchPlaceholder="Search..."
			value={value}
			onChange={(item) => onChange(item)}
			containerStyle={styles.dropdownStyle}
			renderItem={(item) => renderItem(item, labelField)}
			search
			renderInputSearch={() =>
        search ? (
          <View style={styles.inputSearchWrapperStyle}>
            <TextInput
              style={styles.inputSearchStyle}
              placeholder="Search..."
              onChangeText={(text) => {
                setSearchQuery(text);
                onSearch && onSearch(text, items);
              }}
            />
          </View>
        ) : null
      }
			{...rest}
		/>

    // onFocus={() => setIsFocus(true)}
    // onBlur={() => setIsFocus(false)}
    // onChange={item => {
    //   setValue(item.value);
    //   setIsFocus(false);
    // }}
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
	test: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
	},
	inputSearchStyle: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ced4da',
		outlineWidth: 0, // ✅ Removes the focus outline
		height: 40,
		fontSize: 14,
		paddingLeft: 10,
    paddingRight: 10,
	},
	inputSearchWrapperStyle: {
    margin: 6,
    padding: 4,
	},
	dropdownStyle: {
    borderRadius: 12,
    marginTop: 6,
  },
});
