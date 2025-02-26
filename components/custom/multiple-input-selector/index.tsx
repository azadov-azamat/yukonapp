import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { InputSelectorProps } from '@/interface/components';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const MultiSelectDropdown: React.FC<InputSelectorProps<any>> = ({
  label,
  value = [],
  onSearch,
  onChange,
  onClear,
  placeholder,
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = items
    ? search
      ? onSearch
        ? onSearch(searchQuery, items)
        : items
      : items
    : [];

  const renderItem = (item: any) => (
    <View style={styles.item}>
      {rowItem(item)}
      {rightData && rightData(item)}
    </View>
  );

  return (
    <View style={styles.dropdownWrapper}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={[
          styles.iconStyle,
          onClear && value.length ? { marginRight: 30 } : {}
        ]}
        data={filteredData}
        maxHeight={300}
        disable={disabled}
        labelField={labelField}
        valueField={valueField}
        placeholder={t(placeholder)}
        searchPlaceholder="Search..."
        value={value}
        onChange={(selectedItems) => onChange(selectedItems)}
        containerStyle={styles.dropdownStyle}
        renderItem={renderItem}
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
      {/* Clear Button */}
      {onClear && value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => onClear([])}>
          <Ionicons name="close-circle" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: 'relative',
    width: '100%',
  },
  dropdown: {
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
  clearButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
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
