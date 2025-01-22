import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { ButtonProps } from '@/interface/components';
import { TabBarIcon } from "../../navigation/tab-bar-icon";

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false, // Yuklanish holati uchun default false
  disabled = false, // Faollik holati uchun default false
  buttonStyle = "",
  textStyle = "",
  isIcon = false,
  iconName,
  iconSize = 22
}) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled} // Yuklanish yoki disabled bo'lsa, bosishni o'chiradi
      className={`flex-row items-center justify-center py-2 px-5 rounded ${buttonStyle}`}
      style={{
        opacity: loading || disabled ? 0.6 : 1, // Yuklanish vaqti yoki disabled holatda tugma yarim shaffof
      }}
    >
      {/* Agar yuklanish bo'lsa, yuklanish indikatorini ko'rsatamiz */}
      {loading ? (
        <ActivityIndicator size={iconSize} color="white" />
      ) : (
        isIcon 
        ? <TabBarIcon name={iconName} size={iconSize} color={'white'} className="m-0"/> 
        : 
          <Text className={`${buttonStyle && 'text-white'} text-lg ${textStyle}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;