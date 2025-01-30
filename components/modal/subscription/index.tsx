import React from 'react'
import DynamicModal from '../dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';
import { View, Text, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from "react-native";
import { getPlans } from '@/redux/reducers/variable';
import { formatPrice, getName } from '@/utils/general';
import { useTranslation } from 'react-i18next';
import { CustomButton, CustomOpenLink } from '@/components/customs';
import { useRouter } from "expo-router";

const SubscriptionModal: React.FC<ModalItemProps> = ({ open, toggle }) => {

    const router = useRouter();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
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
    
    const handleSubscribe = (id: number) => {
        toggle(false);
        router.push(`/subscription/${id}`)
    }
    
    return (
        <DynamicModal open={open} toggle={toggle}>
             <View className="flex-1">
                {/* Header */}
                <View className='flex-row items-start flex-1 gap-2'>
                    {/* <Ionicons name='alert-circle-sharp'/> */}
                    <Text className="text-base font-bold text-center text-red-600 light-0">
                        {t ('daily-limit-text')}
                    </Text>
                </View>

                <ScrollView className="my-3 space-y-4">
                    {plans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            onPress={() => handleSelectPlan(plan?.id)}
                            className={`p-4 bg-white border rounded-lg border-border-color`}
                        >
                            <Text className="text-lg font-semibold text-gray-800">{getName(plan, 'name')}</Text>
                            <Text className="mt-2 text-sm text-gray-600">{getName(plan, 'description')}</Text>
                            <View className='flex-row items-center justify-between flex-1 mt-4'>
                                <Text className="text-xl font-bold text-gray-900">{formatPrice(plan.price)}</Text>
                                <CustomButton
                                    title={t ('subscribe')}
                                    onPress={() => handleSubscribe(plan.id)}
                                    disabled={!selectedId}
                                    buttonStyle="py-1 px-3 bg-primary"
                                    textStyle='text-base'
                                />                
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <CustomOpenLink url='https://t.me/marina_laty' hasIcon={false} text={t ('ask-to-support')}/>
                

            </View>
        </DynamicModal>
    )
}

export default SubscriptionModal