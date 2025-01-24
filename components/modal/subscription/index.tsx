import React from 'react'
import DynamicModal from '../dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { getPlanById, getPlans } from '@/redux/reducers/variable';
import { formatPrice, getName } from '@/utils/general';
import { useTranslation } from 'react-i18next';

const SubscriptionModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {plans, loading} = useAppSelector(state => state.variable);
    const [selectedId, setSelected] = React.useState<number | null>(null);
    
    React.useEffect(() => {
        dispatch(getPlans());
    }, []);

    const handleSelectPlan = (id: number) => {
        setSelected(id);
    };

    if (loading) return <Text className="text-lg text-center text-gray-700">Yuklanmoqda...</Text>;

    return (
        <DynamicModal open={open} toggle={toggle}>
             <View className="flex-1">
            {/* Header */}
            <Text className="mb-4 text-base font-bold text-center text-red-600">
                {t ('daily-limit-text')}
            </Text>

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
        </View>
        </DynamicModal>
    )
}

export default SubscriptionModal