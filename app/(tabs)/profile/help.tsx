import { Text, View, Linking, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const HelpPage = React.memo(() => {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleContactPress = (link: string) => {
    Linking.openURL(link);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderListItems = (baseKey: string, count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <View key={i} className="flex-row items-start mb-2">
        <Text className="mr-2 text-lg text-primary-descr-color">•</Text>
        <Text className="flex-1 text-lg text-primary-descr-color">
          {t(`${baseKey}.${i + 1}`)}
        </Text>
      </View>
    ));
  };

  return (
    <ScrollView className="flex-1 p-5 bg-card-background">
      <View className="p-4 mb-8 bg-white rounded-lg shadow-md">
        <Text className="mb-3 text-2xl font-bold text-primary-title-color">{t('help-center.title')}</Text>
        <Text className="text-lg text-primary-descr-color">{t('help-center.description')}</Text>
      </View>

      {[
        { key: 'guide', title: t('help-center.guide.title'), filtersCount: 3, detailsCount: 3 },
        { key: 'profile', title: t('help-center.profile.title'), stepsCount: 4 },
        { key: 'addCargo', title: t('help-center.addCargo.title'), stepsCount: 4 },
        { key: 'contact', title: t('help-center.contact.title') },
      ].map((section) => (
        <View key={section.key} className="mb-4">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md"
            onPress={() => toggleSection(section.key)}
          >
            <Text className="text-lg font-bold text-primary-title-color">{section.title}</Text>
            <Ionicons
              name={expandedSection === section.key ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {expandedSection === section.key && (
            <View className="p-4 mt-2 bg-white rounded-lg shadow-md">
              {section.key === 'guide' && (
                <>
                  <Text className="text-lg font-semibold text-primary-title-color">{t('help-center.guide.filters.title')}</Text>
                  <Text className="text-lg text-primary-descr-color">{t('help-center.guide.filters.description')}</Text>
                  {renderListItems('help-center.guide.filters.items', section.filtersCount || 0 )}
                  <Text className="mt-4 text-lg font-semibold text-primary-title-color">{t('help-center.guide.details.title')}</Text>
                  <Text className="text-lg text-primary-descr-color">{t('help-center.guide.details.description')}</Text>
                  {renderListItems('help-center.guide.details.items', section.detailsCount || 0)}
                </>
              )}
              {section.key === 'profile' && renderListItems('help-center.profile.steps', section.stepsCount || 0)}
              {section.key === 'addCargo' && renderListItems('help-center.addCargo.steps', section.stepsCount || 0)}
              {section.key === 'contact' && (
                <>
                  <Text className="text-lg text-primary-descr-color">{t('help-center.contact.description')}</Text>
                  <TouchableOpacity className="px-6 py-3 mt-3 rounded bg-primary" onPress={() => handleContactPress(t ('help-center.contact.support.link'))}>
                    <Text className="text-lg text-center text-white">{t('help-center.contact.support.name')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
});

export default HelpPage;