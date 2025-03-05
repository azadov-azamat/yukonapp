import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AdsFormComponent from '@/components/forms/ads-form';
import { clearLoad } from '@/redux/reducers/load';
import { useAppDispatch } from '@/redux/hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdsEditCreate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams(); 
  
  // const { load } = useAppSelector(state => state.load);
  const param = params['edit-create'];
  
  React.useEffect(() => {
    return () => {
      dispatch(clearLoad());
    }
  }, []);  
  
  return (
    <SafeAreaProvider className='flex-1 px-4 bg-primary-light/20 dark:bg-primary-dark/20'>
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
