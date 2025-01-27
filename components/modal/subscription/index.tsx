import React from 'react'
import DynamicModal from '../dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getPlans } from '@/redux/reducers/variable';
import { formatPrice, getName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { CustomButton, CustomOpenLink } from '@/components/customs';
import { Ionicons } from '@expo/vector-icons';
// import RenderHTML from 'react-native-render-html';

const SubscriptionModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {plans, loading} = useAppSelector(state => state.variable);
    const [selectedId, setSelected] = React.useState<number | null>(null);
    
    React.useEffect(() => {
        dispatch(getPlans());
    }, []);

    React.useEffect(() => {
        if (plans.length) {
            setSelected(plans[0].id);
        }    
    }, [plans]);

    const handleSelectPlan = (id: number) => {
        setSelected(id);
    };

    if (loading) return "";

    // const source = {
    //     html: t('ask-to-support'),
    //   };
    
    return (
        <DynamicModal open={open} toggle={toggle}>
             <View className="relative flex-1">
                {/* Header */}
                <View className='flex-row items-start flex-1 gap-2 mb-4'>
                    <Ionicons name='alert-circle-sharp'/>
                    <Text className="text-base font-bold text-center text-red-600 light-0">
                        {t ('daily-limit-text')}
                    </Text>
                </View>

                <ScrollView className="space-y-4">
                    {/* Barcha rejalar ro'yxati */}
                    {plans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            onPress={() => handleSelectPlan(plan?.id)}
                            className={`p-4 bg-white border rounded-lg shadow-md ${selectedId === plan.id ? 'border-primary' :'border-border-color'} `}
                        >
                            <Text className="text-lg font-semibold text-gray-800">{getName(plan, 'name')}</Text>
                            <Text className="mt-2 text-sm text-gray-600">{getName(plan, 'description')}</Text>
                            <Text className="mt-4 text-xl font-bold text-gray-900">{formatPrice(plan.price)}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View className='flex items-center gap-2 my-2'>
                    <Ionicons name='alert-circle-sharp'/>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
        {t('ask-to-support')} {/* Agar qo'shimcha matn kerak bo'lsa */}
      </Text>
      {/* <RenderHTML
        contentWidth={300}
        source={source}
      /> */}
                </View>
                
                    <CustomButton
                        title={t ('subscribe')}
                        onPress={() => Alert.alert("Obuna bo'lish")}
                        buttonStyle="w-full p-3 bg-primary"
                    />
            </View>
        </DynamicModal>
    )
}

export default SubscriptionModal