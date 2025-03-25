import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { useAppDispatch } from '@/redux/hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { clearLoad } from '@/redux/reducers/load';
import AdsFormComponent from '@/components/forms/ads-form';

const AdsEditCreate = () => {

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
    <SafeAreaProvider className='flex-1 px-4 bg-primary-light dark:bg-primary-dark'>
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
