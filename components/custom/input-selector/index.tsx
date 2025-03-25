import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { InputSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeContext';
import { CustomInput } from '..';

const Input: React.FC<InputSelectorProps<any>> = ({
  label,
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
  const {theme, isDarkMode} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

	const filteredData = items
		? search
			? onSearch
				? onSearch(searchQuery, items)
				: items
			: items
		: [];

	const renderItem = (item: any) => {		
		return (
		<View className='flex-row items-center justify-between pt-3 pb-3 pl-1 pr-1 mx-3'>
			{rowItem(item)}
			{rightData && rightData(item)}
		</View>
		)
  };

	return (
		<View>
			{label && <Text className="mb-2 text-[15px] leading-[22.5px] font-semibold text-primary-title-color dark:text-primary-light">{label}</Text>}
			<View style={[styles.dropdownWrapper, disabled && styles.disabledWrapper]}>
				<Dropdown
					style={[styles.dropdown, {backgroundColor: theme.colors.cardBackground}]}
					placeholderStyle={{ color: theme.colors.inputColor, ...styles.inputText }}
					selectedTextStyle={{ color: theme.colors.inputColor, ...styles.inputText }}
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
					containerStyle={{...styles.dropdownStyle, backgroundColor: theme.colors.cardBackground, borderWidth: 0}}
					onFocus={() => setIsFocus(true)}
					onBlur={() => setIsFocus(false)}
					renderItem={(item) => renderItem(item)}
					search
					renderInputSearch={() =>
						search ? (
							<View style={{...styles.inputSearchWrapperStyle, borderColor: theme.colors.border}}>
								<CustomInput
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

				{/* {disabled && <View style={styles.disabledOverlay} />} */}
			</View>
		</View>
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
    opacity: 0.3, // Apply opacity to indicate it's disabled
  },
	dropdown: {
		// margin: 16,
		paddingTop: 12,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 12,
		height: 48,
		borderColor: '#ced4da',
		// borderWidth: 1,
		borderRadius: 12,
	},
  clearButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  inputText: {
	fontSize: 14, 
	lineHeight: 20
  },
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchWrapperStyle: {
    	margin: 6,
   		padding: 4,
		borderBottomWidth: 1,
	},

	dropdownStyle: {
    	borderRadius: 12,
    	marginTop: 6,
  },
});
