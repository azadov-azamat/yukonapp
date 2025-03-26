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
import { updateLoad, getLoadById, createLoad, clearLoad } from '@/redux/reducers/load';
import { getName } from '@/utils/general';
import { CustomButton, CustomInput, CustomInputSelector } from '../custom';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OPTIONS } from '@/utils/constants';
import LoadModel from '@/models/load';
import VehicleModel from '@/models/vehicle';
import CityModel from '@/models/city';
import DatePickerModal from 'react-native-paper-dates/src/Date/DatePickerModal';
import CountryModel from '@/models/country';
import { useTheme } from '@/config/ThemeContext';
import { clearVehicle } from '@/redux/reducers/vehicle';
// import { updateVehicle, createVehicle } from '@/redux/reducers/vehicle';

const AdsFormComponent: React.FC<{recordId: number, close?: () => void, model?: 'load' | 'vehicle'}> = ({recordId, close, model = 'load'}) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const formikRef = React.useRef<any>(null);

    const { user } = useAppSelector((state) => state.auth);
    const { load } = useAppSelector((state) => state.load);
    const { vehicle } = useAppSelector((state) => state.vehicle);
    const { allCountries, loading: countryLoading } = useAppSelector((state) => state.country);
    const { countryCities } = useAppSelector((state) => state.city);
    const { theme } = useTheme();

    const [originLoading, setOriginLoading] = React.useState(false);
    const [destinationLoading, setDestinationLoading] = React.useState(false);
    
    const [record, setRecord] = React.useState(model === 'load' ? new LoadModel({}) : new VehicleModel({}));
    const [selectedAdType, setSelectedAdType] = React.useState(model);
    const [hasPrepayment, setHasPrepayment] = React.useState(false);
    const [prepaymentPercentage, setPrepaymentPercentage] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const currentLanguage = i18n.language;
    const textClass = 'text-sm text-primary-title-color dark:text-primary-light focus-visible:outline-0 focus:outline-0';
    
    const adTypes = [
        { value: 'load', label: t('bookmarks.load'), icon: 'cube-outline' as const},
        { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car-outline' as const},
    ];
    
    React.useEffect(() => {
        dispatch(fetchCountries());

        if (recordId !== 0) {
            dispatch(getLoadById(recordId.toString()));
        } else {
            dispatch(clearLoad());
        }
    }, [recordId]);
    
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
    
    const renderCustomInput = (label: string, value: string, onChangeText: (text: string) => void, placeholder: string = 'enter-value',editable: boolean = true) => (
        <CustomInput
          label={t(`loads.${label}`)}
          value={value}
          placeholder={t(placeholder)}
          onChangeText={onChangeText}
          divClass='mt-4'
          editable={editable}
        />
    );

    const resetFormValues = () => formikRef.current?.resetForm();
    
    const onClearField = React.useCallback((setFieldValue: (field: string, value: any) => void, field: string) => {
        setFieldValue(field, null);
    }, []);

    React.useEffect(() => {        
        formikRef.current?.setFieldValue('phone', user?.phone)
    }, [recordId, selectedAdType]);
    
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
      
    React.useEffect(() => {
        if (formikRef.current?.values.price && prepaymentPercentage) {
            const calculatedAmount = (parseFloat(formikRef.current?.values.price) * parseFloat(prepaymentPercentage) / 100).toFixed(2);
            formikRef.current?.setFieldValue('prepaymentAmount', Math.round(Number(calculatedAmount)));
            if (Number(calculatedAmount) > 0) {
                formikRef.current?.setFieldValue('hasPrepayment', true);
            } else {
                formikRef.current?.setFieldValue('hasPrepayment', false);
            }
        } else {
            formikRef.current?.setFieldValue('prepaymentAmount', '');    
        }
    }, [formikRef.current?.values.price, prepaymentPercentage]);
   
    React.useEffect(() => {
        setHasPrepayment((record as LoadModel)?.hasPrepayment || false);
    }, [(record as LoadModel)?.hasPrepayment]);  

    React.useEffect(() => {
        const price = (record as LoadModel)?.price;
        
        if (price) {
            setPrepaymentPercentage(Math.round((record as LoadModel)?.prepaymentAmount / (record as LoadModel)?.price * 100).toString())
        }
    }, [(record as LoadModel)?.price]);    

  return (
    <Formik
    innerRef={formikRef}
    initialValues={record}
    // validationSchema={adsValidationSchema}
    enableReinitialize
    onSubmit={async (values, { resetForm }) => {

     if (recordId === 0) {
        if (model === 'load') {
            await dispatch(createLoad(values as LoadModel));
        } else {
            console.log(values);
            // await dispatch(createVehicle(values as VehicleModel));
        }
     } else {
       if (model === 'load') {
        await dispatch(updateLoad({ id: recordId.toString(), data: values as LoadModel }));
       } else {
        console.log(values);
        // await dispatch(updateVehicle({ id: recordId.toString(), data: values as VehicleModel }));
       }
     }

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
                 <Text className="pb-2 text-[15px] leading-[22.5px] font-semibold text-primary-title-color dark:text-primary-light">
                    {t('table.ad-type')}
                </Text>
                <View className="flex-row items-center w-full space-x-4">
                {adTypes.map((type) => (
                    <TouchableOpacity
                    key={type.value}
                    onPress={() => setSelectedAdType(type.value as 'load' | 'vehicle')}
                    className={`flex-1 flex-row  justify-center items-center px-4 h-12 rounded-xl  ${
                        selectedAdType === type.value ? 'bg-primary ' : 'bg-primary-bg-light dark:bg-primary-bg-dark '
                    }`}
                    >
                    {type.icon && (
                        <Ionicons
                        name={type.icon}
                        size={24}
                        color={selectedAdType === type.value ? theme.colors.light : theme.colors.iconTheme}
                        style={{ marginRight: 8 }}
                        />
                    )}
                    <Text
                        className={`text-sm font-medium capitalize ${
                        selectedAdType === type.value ? 'text-primary-light' : 'text-primary-title-color dark:text-primary-bg-light'
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

          <View className="pt-4">
            <CustomInputSelector
                label={t('where-from')}
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
                rowItem={(item) => <Text className={textClass}>{getName(item, 'name')}</Text>}
            />
          </View>
          <View className="pt-4">
            <CustomInputSelector
                search
                value={values.originCity}
                onChange={(item: CityModel) => handleCityChange(item, setFieldValue, 'originCity')}
                onClear={() => onClearField(setFieldValue, 'originCity')}
                placeholder={t('select-city')}
                loading={originLoading}
                disabled={!values.originCountry}
                items={getSortedCitiesByCountryId(values.originCountry?.id as any)}
                labelField={'name' + capitalize(currentLanguage)}
                valueField="id"
                searchFunction={(query: string, items: CityModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                rowItem={(item) => <Text className={textClass}>{getName(item, 'name')}</Text>}
            />
          </View>

          {selectedAdType === 'load' && <>
            <View className="pt-4">
                <CustomInputSelector
                    search
                    label={t('where-to')}
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
                    rowItem={(item) => <Text className={textClass}>{getName(item, 'name')}</Text>}
                />
            </View>
            <View className="pt-4">
                <CustomInputSelector
                    search
                    value={(values as LoadModel).destinationCity}
                    onChange={(item: CityModel) => handleCityChange(item, setFieldValue, 'destinationCity')}
                    onClear={() => onClearField(setFieldValue, 'destinationCity')}
                    placeholder={t('select-city')}
                    loading={destinationLoading}
                    disabled={!(values as LoadModel).destinationCountry}
                    items={getSortedCitiesByCountryId((values as LoadModel).destinationCountry?.id as any)}
                    labelField={'name' + capitalize(currentLanguage)}
                    valueField="id"
                    searchFunction={(query: string, items: CityModel[]) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase()))}
                    rowItem={(item) => <Text className={textClass}>{getName(item, 'name')}</Text>}
                />
            </View>
          </>}
        </View>

        {selectedAdType === 'load' && 'goods' in values && renderCustomInput('goods', values.goods, handleChange('goods'))}
        {renderCustomInput('phone', values.phone as string, handleChange('phone'))}

        {selectedAdType === 'load' && 'cargoType' in values && <View className="pt-4">
            <CustomInputSelector
                translate
                label={t('loads.truck-type')}
                value={OPTIONS['truck-types'].find(item => item.value === values.cargoType)}
                onChange={(item) => setFieldValue('cargoType', item.value)}
                placeholder={t('loads.truck-type')}
                items={OPTIONS['truck-types']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text className={textClass}>{t(item.label)}</Text>}
            />
        </View>}

        {selectedAdType === 'vehicle' && 'truckType' in values && <View className="pt-4">
            <CustomInputSelector
                translate
                label={t('loads.truck-type')}
                value={OPTIONS['truck-types'].find(item => item.value === values.truckType)}
                onChange={(item) => setFieldValue('truckType', item.value)}
                placeholder={t('loads.truck-type')}
                items={OPTIONS['truck-types']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text className={textClass}>{t(item.label)}</Text>}
            />
        </View>}
        
        {renderCustomInput(selectedAdType === 'load' ?'weight' : 'load-capacity', values.weight?.toString(), handleChange('weight'))}

        {selectedAdType === 'load' && <View className="flex-row items-end space-x-2">
          <View className="flex-1">
            {renderCustomInput('price', (values as LoadModel).price?.toString(), handleChange('price'))}
          </View>
          <View className="w-24">
            <CustomInputSelector
                value={OPTIONS['currencies'].find(item => item.value === values.currency)}
                onChange={(item: any) => setFieldValue('currency', item.value)}
                placeholder={t('loads.currency')}
                items={OPTIONS['currencies']}
                labelField="label"
                valueField="value"
                rowItem={(item) => <Text className={textClass}>{item.label}</Text>}
            />
          </View>
        </View>}
        {selectedAdType === 'load' && 'loadReadyDate' in values && (
            <>
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <CustomInput
                        label={t('loads.load-ready-date')}
                        value={values.loadReadyDate || 'yyyy-mm-dd'}
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
            </>
        )}
        {renderCustomInput('description', values.description, handleChange('description'))}

        {selectedAdType === 'load' && (<View className="flex-row items-center space-x-2 pt-2.5">
            <Text className='text-[15px] leading-[22.5px] font-semibold text-primary-title-color dark:text-primary-light capitalize'>
                {t('prepayment')}
            </Text>
            <Switch
                value={hasPrepayment}
                onValueChange={setHasPrepayment}
                trackColor={{ false: theme.colors.backdrop, true: theme.colors.primary }}
                thumbColor={theme.colors.primary}
            />
        </View>)}
        {(hasPrepayment && selectedAdType === 'load') && (
            <>
                {renderCustomInput('prepayment-percentage', prepaymentPercentage, (text: string) => setPrepaymentPercentage(text))}
                {renderCustomInput('prepayment-amount', (values as LoadModel).prepaymentAmount?.toString(), handleChange('prepaymentAmount'), 'no-enter-value', false)}
            </>
        )}
        <CustomButton onPress={handleSubmit} buttonStyle={'bg-primary my-4'} title={t('save')} />
      </View>
    )}
    </Formik>
  )
}

export default AdsFormComponent;
