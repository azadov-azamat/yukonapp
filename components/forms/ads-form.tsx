import {  Text, TouchableOpacity, View, TextInput } from 'react-native'
import React from 'react'
import { ICountryModel } from '@/interface/redux/variable.interface'
import { Formik } from 'formik'
import { capitalize, set } from 'lodash';
import { ICityModel } from '@/interface/redux/variable.interface';
import { getCities, getCountryCities } from '@/redux/reducers/city';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next';
import { fetchCountries } from '@/redux/reducers/country';
import { createLoad, updateLoad, getLoadById } from '@/redux/reducers/load';
import { ILoadModel } from '@/interface/redux/load.interface';
import { getName } from '@/utils/general';
import { CustomButton, CustomInput, CustomInputSelector } from '../custom';
import { adsValidationSchema } from '@/validations/form';
import { Ionicons } from '@expo/vector-icons';
import { OPTIONS } from '@/utils/constants';
import LoadModel from '@/models/load';
import { LoadSerializer } from '@/serializers';
import VehicleModel from '@/models/vehicle';
import CityModel from '@/models/city';
import { DatePickerModal } from 'react-native-paper-dates';

const AdsFormComponent: React.FC<{recordId: number, close?: () => void, model?: 'load' | 'vehicle'}> = ({recordId, close, model = 'load'}) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    
    
    const { user } = useAppSelector((state) => state.auth);
    const { load } = useAppSelector((state) => state.load);
    const { vehicle } = useAppSelector((state) => state.vehicle);
    const { allCountries, countries, loading: countryLoading } = useAppSelector((state) => state.country);
    const { countryCities } = useAppSelector((state) => state.city);
    const [originCities, setOriginCities] = React.useState<ICityModel[]>([]);
    const [destinationCities, setDestinationCities] = React.useState<ICityModel[]>([]);
    const [originLoading, setOriginLoading] = React.useState(false);
    const [destinationLoading, setDestinationLoading] = React.useState(false);
    const [truckTypes, setTruckTypes] = React.useState(OPTIONS['truck-types']);
    
    const currentLanguage = i18n.language;

    const [record, setRecord] = React.useState(model === 'load' ? new LoadModel({}) : new VehicleModel({}));

    // const [initialValues, setInitialValues] = React.useState({
    //   goods: '',
    //   phone: '',
    //   truckType: '',
    //   weight: '',
    //   originCountry: null,
    //   destinationCountry: null,
    //   originCity: null,
    //   destinationCity: null,
    //   currency: 'UZS',
    //   price: '',
    //   loadReadyDate: '',
    //   description: '',
    // });
  
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

        if (price && prepaymentPercentage) {
            const calculatedAmount = (parseFloat(price) * parseFloat(prepaymentPercentage) / 100).toFixed(2);
            setPrepaymentAmount(calculatedAmount);
        }
    }, [recordId]);

    // console.log("countryCities", countryCities);
    const adTypes = [
        { value: 'load', label: t('bookmarks.load'), icon: 'cube-outline' as const},
        { value: 'vehicle', label: t('bookmarks.vehicle'), icon: 'car-outline' as const},
      ];
    
    const handleCountryChange = async (
        item: ICountryModel,
        setFieldValue: (field: string, value: any) => void,
        // setCities: (cities: ICityModel[]) => void,
        // set÷Loading: (loading: boolean) => void,
        field: string
    ) => {
        setFieldValue(field, item);
        // setLoading(true);
        await dispatch(getCountryCities({ countryId: item.id }));
        // setLoading(false);
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
        // console.log("renderCustomInputSelector", labelField);
        
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
            if (load) {
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
            if (vehicle) {
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
    //  const updatedModel = new LoadModel({
    //    ...loadModel,
    //    ...values,
    //    id: recordId === 0 ? null : recordId,
    //  });
    console.log(values  );

    //  console.log("values", LoadSerializer.serialize(updatedModel));
    //  console.log("updateLoad", updatedModel);
     
    //  if (recordId === 0) {
    //    await dispatch(createLoad(updatedModel));
    //  } else {
    //    await dispatch(updateLoad({ id: recordId, ...updatedModel }));
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
            {renderCustomInputSelector(
                'country',
                t('select-country'), 
                values.originCountry, 
                (item: ICountryModel) => handleCountryChange(item, setFieldValue, 'originCountry'), 
                () => onClearOriginCountry(setFieldValue), allCountries, countryLoading, false, 'name' + capitalize(currentLanguage), 'id', 
                (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))
            }
          </View>
          <View className="pt-4">
            {renderCustomInputSelector('city', t('select-city'), 
            values.originCity, 
            (item: ICityModel) => handleCityChange(item, setFieldValue, 'originCity'), 
            () => onClearOriginCity(setFieldValue), getSortedCitiesByCountryId(values.originCountry?.id as any), originLoading, !values.originCountry, 'name' + capitalize(currentLanguage), 'id', 
            (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
          </View>

          {selectedAdType === 'load' && <>
            <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("where-to")}
            </Text>
            <View className="pt-4">
                {selectedAdType === 'load' && 'destinationCountry' in values && renderCustomInputSelector('country', t('select-country'), 
                                                                        values.destinationCountry,
                                                                        (item: ICountryModel) => handleCountryChange(item, setFieldValue, 'destinationCountry'), 
                                                                        () => onClearDestinationCountry(setFieldValue), allCountries, countryLoading, !values.originCountry, 'name' + capitalize(currentLanguage), 'id', 
                                                                        (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
            </View>
            <View className="pt-4">
                {selectedAdType === 'load' && 'destinationCity' in values && renderCustomInputSelector('city', t('select-city'), 
                                                                        values.destinationCity, 
                                                                        (item: ICityModel) => handleCityChange(item, setFieldValue, 'destinationCity'), 
                                                                        () => onClearDestinationCity(setFieldValue), getSortedCitiesByCountryId(values.destinationCountry?.id as any), destinationLoading, !values.destinationCountry, 'name' + capitalize(currentLanguage), 'id', 
                                                                        (query, items) => items.filter(item => item.names.toLowerCase().includes(query.toLowerCase())))}
            </View>
          </>}
        </View>

        {selectedAdType === 'load' && 'goods' in values && renderCustomInput('goods', values.goods, handleChange('goods'))}
        {renderCustomInput('phone', values.phone as string, handleChange('phone'))}

        {selectedAdType === 'load' && 'cargoType' in values && <View className="pt-4">
            <Text className="mt-4 mb-1.5 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("loads.truck-type")}
            </Text>
            {renderCustomInputSelector(
            t('loads.truck-type'),
            t('loads.truck-type'),
            values.cargoType,
            (item: any) => handleCityChange(item.value, setFieldValue, 'cargoType'),
            () => setFieldValue('cargoType', ''),
            OPTIONS['truck-types'],
            false,
            false,
            'label',
            'value',
            undefined,
            (item) => <Text>{t (item.label)}</Text>,
            false
            )}
        </View>}

        {selectedAdType === 'vehicle' && 'truckType' in values && <View className="pt-4">
            <Text className="mt-4 mb-1.5 text-lg font-semibold text-gray-700 dark:text-white">
                {t ("loads.truck-type")}
            </Text>
            {renderCustomInputSelector(
            t('loads.truck-type'),
            t('loads.truck-type'),
            values.truckType,
            handleChange('truckType'),
            () => setFieldValue('truckType', ''),
            OPTIONS['truck-types'],
            false,
            false,
            'label',
            'value',
            (query: string, items: any[]) => items.filter((item: any) => item.label.toLowerCase().includes(query.toLowerCase())),
            (item) => <Text>{t(item.label)}</Text>
            )}
        </View>}
        
        {renderCustomInput('weight', values.weight?.toString(), handleChange('weight'))}

        {selectedAdType === 'load' && 'currency' in values && <View className="flex-row items-end space-x-2">
          <View className="flex-1">
            {renderCustomInput('price', values.price?.toString(), (text) => setPrice(text))}
          </View>
          <View className="w-24">
            {renderCustomInputSelector(
                'currency',
                t('loads.currency'), 
                values.currency,
                handleChange('currency'),
                () => setFieldValue('currency', ''),
                OPTIONS['currencies'],
                false,
                false,
                'label',
                'value',
                undefined,
                (item) => <Text>{item}</Text>,
                false
            )}
          </View>
        </View>}
        {selectedAdType === 'load' && 'loadReadyDate' in values && (
            <View className="pt-4">
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

        <View className="pt-4">
            <TouchableOpacity onPress={() => setPrepayment(!prepayment)}>
                <Text>{t('prepayment')}</Text>
            </TouchableOpacity>
            {prepayment && (
                <>
                    {renderCustomInput('prepaymentPercentage', prepaymentPercentage, (text) => setPrepaymentPercentage(text))}
                    <Text>{t('prepaymentAmount')}: {prepaymentAmount}</Text>
                </>
            )}
        </View>
        <CustomButton onPress={handleSubmit} buttonStyle={'bg-primary my-4'} title={t('save')} />
      </View>
    )}
    </Formik>
  )
}

export default AdsFormComponent;
