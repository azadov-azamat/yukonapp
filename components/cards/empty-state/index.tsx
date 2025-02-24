import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

const EmptyState: React.FC<{type: string}> = ({ type }) => {
    const { t } = useTranslation();
    
    return (
        <View className="p-6 border rounded-lg shadow-md border-border-color/20 bg-primary-light dark:bg-primary-dark/20">
            <Text className="mb-2 text-lg font-bold text-center text-primary-title-color dark:text-white">{t ('not-found.' + type + '.title')}</Text>
            <Text className="text-sm text-center text-primary-desc-color dark:text-border-color/20">{t ('not-found.' + type + '.description')}</Text>
        </View>
    );
};

export default EmptyState;
