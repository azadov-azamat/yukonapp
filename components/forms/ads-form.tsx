import {  Text, TouchableOpacity, View, TextInput, Switch } from 'react-native'
import React from 'react'
import { ICountryModel } from '@/interface/redux/variable.interface'
import { Formik } from 'formik'
import { capitalize, set, values } from 'lodash';
import { ICityModel } from '@/interface/redux/variable.interface';
import { getCities, getCountryCities } from '@/redux/reducers/city';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next';
import { fetchCountries } from '@/redux/reducers/country';
import { updateLoad, getLoadById } from '@/redux/reducers/load';
import { getName } from '@/utils/general';
import { CustomButton, CustomInput, CustomInputSelector } from '../custom';
import { Ionicons } from '@expo/vector-icons';
import { OPTIONS } from '@/utils/constants';
import LoadModel from '@/models/load';
import VehicleModel from '@/models/vehicle';
import CityModel from '@/models/city';
import { DatePickerModal } from 'react-native-paper-dates';
import CountryModel from '@/models/country';
import { useTheme } from '@/config/ThemeContext';
import { updateVehicle } from '@/redux/reducers/vehicle';
import { all } from 'axios';

const AdsFormComponent: React.FC<{recordId: number, close?: () => void, model?: 'load' | 'vehicle'}> = ({recordId, close, model = 'load'}) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    
    console.log("ads-form componentrendering...");
    const { user } = useAppSelector((state) => state.auth);
    const { load } = useAppSelector((state) => state.load);
    const { vehicle } = useAppSelector((state) => state.vehicle);
    const { allCountries, countries, loading: countryLoading } = useAppSelector((state) => state.country);
    const { countryCities } = useAppSelector((state) => state.city);
    const { theme } = useTheme();
    
    const [originLoading, setOriginLoading] = React.useState(false);
    const [destinationLoading, setDestinationLoading] = React.useState(false);
    const [truckType, setTruckType] = React.useState(OPTIONS['truck-types'][0]);
    const [currency, setCurrency] = React.useState(OPTIONS['currencies'][0]);
    
    const currentLanguage = i18n.language;

    const [record, setRecord] = React.useState(model === 'load' ? new LoadModel({}) : new VehicleModel({}));

    const [selectedAdType, setSelectedAdType] = React.useState(model);
    const formikRef = React.useRef<any>(null);
  
    const [prepayment, setPrepayment] = React.useState(false);
    const [prepaymentPercentage, setPrepaymentPercentage] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [prepaymentAmount, setPrepaymentAmount] = React.useState('');

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        dispatch(fetchCountries());

        if (recordId !== 0) {
            dispatch(getLoadById(recordId.toString()));
        }
    }, [recordId]);

    React.useEffect(() => {
        if (formikRef.current?.values.price && prepaymentPercentage) {
            const calculatedAmount = (parseFloat(formikRef.current?.values.price) * parseFloat(prepaymentPercentage) / 100).toFixed(2);
            setPrepaymentAmount(calculatedAmount);
        } else {
            setPrepaymentAmount('');    
        }
    }, [formikRef.current?.values.price, prepaymentPercentage]);
    
    // console.log("countryCities", countryCities);
    const adTypes = [
        { value: 'load', label: t('bookmarks.load'), icon: 'cube-outline' as const},
        { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car-outline' as const},
      ];
    
    const handleCountryChange = async (
        item: ICountryModel,
        setFieldValue: (field: string, value: any) => void,
        field: string
    ) => {
        setFieldValue(field, item);
        await dispatch(getCountryCities({ countryId: item?.id }));
    };
    
    const handleCityChange = (
        item: ICityModel | any,
        setFieldValue: (field: string, value: any) => void,
        field: string
    ) => {
        setFieldValue(field, item);
    };
        
    const getSortedCitiesByCountryId = (countryId: number): ICityModel[] => {
        const cities = countryCities[countryId] || [];
        return cities;
            // return cities.sort((a, b) => a['name' + capitalize(currentLanguage) as keyof CityModel].localeCompare(b['name' + capitalize(currentLanguage) as keyof CityModel]));
    };
  
    function onClearOriginCountry(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('originCountry', null);
		setFieldValue('originCity', null);
	}

	function onClearDestinationCountry(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('destinationCountry', null);
		setFieldValue('destinationCity', null);
	}

	function onClearOriginCity(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('originCity', null);
	}

	function onClearDestinationCity(setFieldValue: (field: string, value: any) => void) {
		setFieldValue('destinationCity', null);
	}
    
    const renderCustomInput = (label: string, value: string, onChangeText: (text: string) => void, editable: boolean = true) => (
        <CustomInput
          label={t(`loads.${label}`)}
          value={value}
          onChangeText={onChangeText}
          divClass='mt-4'
          editable={editable}
        />
      );

      
    const renderCustomInputSelector = (
        label: string,
        placeholder: string,
        value: any,
        onChange: any,
        onClear: any,
        items: any[],
        loading: boolean,
        disabled: boolean,
        labelField: string,
        valueField: string,
        searchFunction?: (query: string, items: any[]) => any[],
        rowItem?: (item: any) => JSX.Element,
        search: boolean = true
    ) => {
        // Translate the selected value
        const translatedValue = value ? t(value[labelField]) : '';

        return (
            <CustomInputSelector
                label={label}
                value={value}
                onChange={onChange}
                onSearch={searchFunction}
                placeholder={placeholder}
                loading={loading}
                disabled={disabled}
                items={items}
                labelField={labelField}
                valueField={valueField}
                search={search}
                onClear={onClear}
                rowItem={rowItem || ((item) => <Text>{getName(item, 'name')}</Text>)}
            />
        )
    };

      const resetFormValues = () => {
        const newModel = new LoadModel({});
        // setLoadModel(newModel);
        formikRef.current?.resetForm();
    };
    
    React.useEffect(() => {        
        formikRef.current?.setFieldValue('phone', user?.phone)
    }, [recordId]);
    
    React.useEffect(() => {
        if (selectedAdType === 'load') {
            if (recordId !== 0 && load) {
                setRecord(load);
                handleCountryChange(load.originCountry as ICountryModel, formikRef.current.setFieldValue, 'originCountry')
                if  (load.destinationCountry) {
                    handleCountryChange(load.destinationCountry as ICountryModel, formikRef.current.setFieldValue, 'destinationCountry')
                }   
                if (load.originCity) {
                    handleCityChange(load.originCity as ICityModel, formikRef.current.setFieldValue, 'originCity')
                }
                if (load.destinationCity) {
                    handleCityChange(load.destinationCity as ICityModel, formikRef.current.setFieldValue, 'destinationCity')
                }
                if (load.cargoType) {
                    handleCityChange(load.cargoType as any, formikRef.current.setFieldValue, 'cargoType')
                }
            } else {
                setRecord(new LoadModel({}));
            }
        } else if (selectedAdType === 'vehicle') {
            if (recordId !== 0 && vehicle) {
                setRecord(vehicle);
            } else {
                setRecord(new VehicleModel({}));
            }
        }
    }, [load, vehicle, selectedAdType]);
      
    const onClearField = React.useCallback((setFieldValue: (field: string, value: any) => void, field: string) => {
        setFieldValue(field, null);
    }, []);
    

  return (
    <Formik
    innerRef={formikRef}
    initialValues={record}
    // validationSchema={adsValidationSchema}
    enableReinitialize
     onSubmit={async (values, { resetForm }) => {
    
    console.log(values  );

    //  if (recordId === 0) {
    //    await dispatch(createLoad(updatedModel));
    //  } else {
    //    if (model === 'load') {
    //     await dispatch(updateLoad(values as LoadModel));
    //    } else {
    //     await dispatch(updateVehicle(values));
    //    }
    //  }

    close?.();
    resetFormValues();
   }}
  >
    {({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
      <View style={{ flex: 1 }}>
        <View className="pt-4">
         {
            recordId === 0 &&  (
                <>
                 <Text className="pb-2 text-lg font-semibold text-gray-700 dark:text-white">
                    Ad type
                </Text>
                <View className="flex-row items-center w-full mb-4 space-x-4">
                {adTypes.map((type) => (
                    <TouchableOpacity
                    key={type.value}
                    onPress={() => setSelectedAdType(type.value as 'load' | 'vehicle')}
                    className={`flex-1 flex-row  justify-center items-center px-4 py-3 rounded-xl border ${
                        selectedAdType === type.value ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-100 border-transparent'
                    }`}
                    >
                    {type.icon && (
                        <Ionicons
                        name={type.icon}
                        size={24}
                        color={selectedAdType === type.value ? '#fff' : '#94a3b8'}
                        style={{ marginRight: 8 }}
                        />
                    )}
                    <Text
                        className={`text-base font-medium capitalize ${
                        selectedAdType === type.value ? 'text-white' : 'text-slate-400'
                        }`}
                    >
                        {type.label}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>
                </>
            )
         }

          <Text className="mt-2 text-lg font-semibold text-gray-700 dark:text-white">
            {t ("where-from")}
          </Text>
          <View className="pt-4">
            <CustomInputSelector
                label={t('country')}
                value={values.originCountry}
                onChange={(item: CountryModel) => handleCountryChange(item, setFieldValue, 'originCountry')}
                onClear={() => onClearOriginCountry(setFieldValue)}
                placeholder={t('select-country')}
                loading={countryLoading}
                disabled={false}    
                items={allCountries}
                labelField={'nameUz'}
                valueField="id"
                search={true}
                searchFunction={(query: string, items: CountryModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
            />
          </View>
          <View className="pt-4">
            <CustomInputSelector
                search
                label={t('city')}
                value={values.originCity}
                onChange={(item: CityModel) => handleCityChange(item, setFieldValue, 'originCity')}
                onClear={() => onClearOriginCity(setFieldValue)}
                placeholder={t('select-city')}
                loading={originLoading}
                disabled={!values.originCountry}
                items={getSortedCitiesByCountryId(values.originCountry?.id as any)}
                labelField={'name' + capitalize(currentLanguage)}
                valueField="id"
                searchFunction={(query: string, items: CityModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
            />
          </View>

          {selectedAdType === 'load' && <>
            <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("where-to")}
            </Text>
            <View className="pt-4">
                <CustomInputSelector
                    label={t('country')}
                    value={(values as LoadModel).destinationCountry}
                    onChange={(item: CountryModel) => handleCountryChange(item, setFieldValue, 'destinationCountry')}
                    onClear={() => onClearDestinationCountry(setFieldValue)}
                    placeholder={t('select-country')}
                    loading={countryLoading}
                    disabled={!values.originCountry}
                    items={allCountries}
                    labelField={'nameUz'}
                    valueField="id"
                    searchFunction={(query: string, items: CountryModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                    rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
                />
            </View>
            <View className="pt-4">
                <CustomInputSelector
                    label={t('city')}
                    value={(values as LoadModel).destinationCity}
                    onChange={(item: CityModel) => handleCityChange(item, setFieldValue, 'destinationCity')}
                    onClear={() => onClearDestinationCity(setFieldValue)}
                    placeholder={t('select-city')}
                    loading={destinationLoading}
                    disabled={!(values as LoadModel).destinationCountry}
                    items={getSortedCitiesByCountryId((values as LoadModel).destinationCountry?.id as any)}
                    labelField={'name' + capitalize(currentLanguage)}
                    valueField="id"
                    searchFunction={(query: string, items: CityModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                    rowItem={(item) => <Text>{getName(item, 'name')}</Text>}
                />
            </View>
          </>}
        </View>

        {selectedAdType === 'load' && 'goods' in values && renderCustomInput('goods', values.goods, handleChange('goods'))}
        {renderCustomInput('phone', values.phone as string, handleChange('phone'))}

        {selectedAdType === 'load' && 'cargoType' in values && <View className="pt-4">
            <Text className="mt-4 mb-1.5 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("loads.truck-type")}
            </Text>
            <CustomInputSelector
                translate
                value={OPTIONS['truck-types'].find(item => item.value === values.cargoType)}
                onChange={(item) => setFieldValue('cargoType', item.value)}
                placeholder={t('loads.truck-type')}
                items={OPTIONS['truck-types']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text>{t(item.label)}</Text>}
            />
        </View>}

        {selectedAdType === 'vehicle' && 'truckType' in values && <View className="pt-4">
            <Text className="mt-4 mb-1.5 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("loads.truck-type")}
            </Text>
            <CustomInputSelector
                translate
                value={OPTIONS['truck-types'].find(item => item.value === values.truckType)}
                onChange={(item) => setFieldValue('truckType', item.value)}
                placeholder={t('loads.truck-type')}
                items={OPTIONS['truck-types']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text>{t(item.label)}</Text>}
            />
        </View>}
        
        {renderCustomInput('weight', values.weight?.toString(), handleChange('weight'))}

        {selectedAdType === 'load' && <View className="flex-row items-end space-x-2">
          <View className="flex-1">
            {renderCustomInput('price', (values as LoadModel).price?.toString(), handleChange('price'))}
          </View>
          <View className="w-24">
            <CustomInputSelector
                value={OPTIONS['currencies'].find(item => item.value === values.currency) || 'UZS'}
                onChange={(item: any) => setFieldValue('currency', item.value)}
                placeholder={t('loads.currency')}
                items={OPTIONS['currencies']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text>{item.label}</Text>}
            />
          </View>
        </View>}
        {selectedAdType === 'load' && 'loadReadyDate' in values && (
            <View className="">
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <CustomInput
                        label={t('loads.load-ready-date')}
                        value={values.loadReadyDate || t('select-date')}
                        onChangeText={() => {}}
                        editable={false}
                        divClass='mt-4'
                    />
                </TouchableOpacity>
                <DatePickerModal
                    locale="en" 
                    mode="single"
                    visible={open}
                    saveLabel={t('save')}
                    onDismiss={() => setOpen(false)}
                    date={values.loadReadyDate ? new Date(values.loadReadyDate) : new Date()}
                    onConfirm={(params) => {
                        setFieldValue('loadReadyDate', params.date?.toISOString().split('T')[0]);
                        setOpen(false);
                    }}
                />
            </View>
        )}
        {renderCustomInput('description', values.description, handleChange('description'))}

        <View className="flex-row items-center space-x-2 p-2.5">
            <Text className='text-lg font-semibold text-gray-700 capitalize dark:text-white'>
                {t('prepayment')}
            </Text>
            <Switch
                value={prepayment}
                onValueChange={setPrepayment}
                trackColor={{ false: theme.colors.backdrop, true: theme.colors.primary }}
                thumbColor={theme.colors.primary}
            />
        </View>
        {prepayment && (
            <>
                {renderCustomInput('prepaymentPercentage', prepaymentPercentage, (text) => setPrepaymentPercentage(text))}
                <CustomInput
                        label={t('prepaymentAmount')}
                        value={prepaymentAmount}
                        onChangeText={() => {}}
                        editable={false}
                        divClass='mt-4'
                    />
            </>
        )}
        <CustomButton onPress={handleSubmit} buttonStyle={'bg-primary my-4'} title={t('save')} />
      </View>
    )}
    </Formik>
  )
}

export default AdsFormComponent;
