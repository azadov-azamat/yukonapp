import { CustomButton } from '@/components/custom';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native'

function LoadPaginationData({totalCount, loadsToday, isGridView, toggleView}: {totalCount: number, loadsToday: number, isGridView: boolean, toggleView: () => void}) {
    const { t } = useTranslation();
    
    return (
        <View className="flex-row items-center justify-between p-4 mt-2 rounded-md shadow-sm bg-primary-light dark:bg-primary-dark dark:border border-border-color/20">
                                <View>
                                    <Text className="text-sm font-bold text-primary-dark dark:text-primary-light">
                                        {t ('query-result-message-without-cargo', {
                                            count: totalCount,
                                            todayCounter: loadsToday
                                            }
                                        )}
                                    </Text>
                                </View>
                                <CustomButton
                                    icon={isGridView ? 'list' : 'grid'} // Icon for toggle
                                    isIcon
                                    iconSize={18}
                                    onPress={toggleView}
                                    buttonStyle="bg-primary px-2 py-1"
                                />
                            </View>
    )
}

export default memo(LoadPaginationData)