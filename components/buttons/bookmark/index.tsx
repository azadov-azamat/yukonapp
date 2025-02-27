import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styled } from 'nativewind';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LoadModel from '@/models/load';
import VehicleModel from '@/models/vehicle';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeContext';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const BookmarkButtonComponent = ({model, paramName, style = '', size = 16 }: {model: LoadModel | VehicleModel, paramName: 'bookmarkedLoadIds' | 'bookmarkedVehicleIds', style?: string, size?: number}) => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth)
    const [isBookmarked, setIsBookmarked] = useState(() => {
        const ids = user?.[paramName] || [];
        return ids.includes(String(model.id));
    });
    const { theme } = useTheme();
    
  const toggleBookmark = async () => {
    const id = model.id;
    
    const type = t( paramName === 'bookmarkedLoadIds'
        ? 'bookmarks.load'
        : paramName === 'bookmarkedVehicleIds'
        ? 'bookmarks.vehicle'
        : 'null')

    const ids = user?.[paramName] || [];
    const index = ids.indexOf(String(id));

    let newIds = [...ids];
    let message = null;

    if (index === -1) {
      newIds.push(String(id));
      message = t ('added-bookmark', { adType: type });
    } else {
      newIds = newIds.filter((v) => v !== id);
      message = t('removed-bookmark', { adType: type });
    }

    if (user) {
        user[paramName] = newIds;
        await user.save(dispatch);
    }

    if (message) {
      Toast.show({
        type: 'success',
        text1: message
      })
    }

    setIsBookmarked(!isBookmarked);
  };

  return (
    <StyledView className="flex items-center ml-1">
      {user && (
        <StyledTouchableOpacity
          className={`items-center justify-center w-7 h-7 bg-gray-200 dark:bg-primary-light/20 rounded-full dark:hover:bg-primary-light/30 ${style}`}
          onPress={toggleBookmark}
        >
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={size}  
            color={theme.colors.primary} />
        </StyledTouchableOpacity>
      )}
    </StyledView>
  );
};

export default BookmarkButtonComponent;
