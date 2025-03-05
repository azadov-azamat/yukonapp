import CustomHeader from '@/components/custom/header';
import { RelativePathString, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AdsFormComponent from '@/components/forms/ads-form';
import { getLoadById } from '@/redux/reducers/load';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdsEditCreate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams(); 
  
  // const { load } = useAppSelector(state => state.load);
  const param = params['edit-create'];
  
  // React.useEffect(() => {
  //   if (param !== 'create') {
  //     dispatch(getLoadById(param as string));
  //   }
  // }, [param]);  
  
  return (
    <SafeAreaProvider style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
       <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
        <AdsFormComponent recordId={param !== 'create' ? Number(param) : 0} />
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default AdsEditCreate;
