import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { InputSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeContext';

const Input: React.FC<InputSelectorProps<any>> = ({
//   label,
  value,
  onSearch,
  onChange,
  onClear,
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
  translate = false,
  ...rest
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

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

  const renderLabel = () => {
	if (value || isFocus) {
		console.log(value, labelField);
		
	  return (
		<Text style={[styles.label, isFocus && { color: theme.colors.dark }]}>
		  {value && value[labelField] ? translate ? t (value[labelField])  : value[labelField] : t ('payment-type.not_specified')}
		</Text>
	  );
	}
	return null;
  };
  
	return (
		<View style={[styles.dropdownWrapper, disabled && styles.disabledWrapper]}>
			<Dropdown
				style={styles.dropdown}
				placeholderStyle={styles.placeholderStyle}
				selectedTextStyle={styles.selectedTextStyle}
				iconStyle={[
					styles.iconStyle,
					onClear && value ? { display: 'none' } : {}
				]}
				data={filteredData}
				maxHeight={300}
				disable={disabled}
				labelField={value && value[labelField] ? labelField : t('payment-type.not_specified')}
				valueField={valueField}
				placeholder={!isFocus ? t(placeholder) : '...'}
				searchPlaceholder={t("search")}
				value={value}
				onChange={item => {
					onChange(item);
					setIsFocus(false);
				}}
				containerStyle={styles.dropdownStyle}
				onFocus={() => setIsFocus(true)}
				onBlur={() => setIsFocus(false)}
				renderItem={(item) => renderItem(item, labelField)}
				search
				renderInputSearch={() =>
					search ? (
						<View style={styles.inputSearchWrapperStyle}>
							<TextInput
								style={styles.inputSearchStyle}
								value={searchQuery}
								placeholder={t("search")}
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
			{onClear && value && (
				<TouchableOpacity
					style={styles.clearButton}
					onPress={() => {
						onClear(null);
						setSearchQuery('');
					}}
				>
          <Ionicons name="close-circle" size={20} color="red" />
        </TouchableOpacity>
      )}

			{disabled && <View style={styles.disabledOverlay} />}
		</View>

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
	dropdownWrapper: {
    position: 'relative',
		width: '100%',
  },
	disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Black overlay with opacity
    borderRadius: 12,
  },
	disabledWrapper: {
    opacity: 0.6, // Apply opacity to indicate it's disabled
  },
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
		paddingTop: 14,
		paddingBottom: 14,
		paddingLeft: 4,
		paddingRight: 4,
		marginLeft: 12,
		marginRight: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderTopWidth: 1,
		// borderColor: '#e4e6e8'
	},
	clearButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
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
		// outlineWidth: 0, // ✅ Removes the focus outline
		height: 40,
		fontSize: 14,
		paddingLeft: 10,
    paddingRight: 10,
	},
	inputSearchWrapperStyle: {
    margin: 6,
    padding: 4,
	},
	label: {
		position: 'absolute',
		backgroundColor: 'white',
		left: 10,
		top: 16,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 16,
		paddingRight: 24,
	},
	dropdownStyle: {
    borderRadius: 12,
    marginTop: 6,
  },
});
