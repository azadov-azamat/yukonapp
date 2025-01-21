import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

const EmptyState: React.FC<{type: string}> = ({ type }) => {
    const { t } = useTranslation();
    return (
        <View className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <Text className="mb-2 text-lg font-bold text-center text-primary">{t ('not-found.' + type + '.title')}</Text>
            <Text className="text-sm text-center text-secondary">{t ('not-found.' + type + '.description')}</Text>
        </View>
    );
};

export default EmptyState;
