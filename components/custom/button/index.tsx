import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";  // Import Ionicons

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false, // Default loading state
  disabled = false, // Default disabled state
  buttonStyle = "",
  textStyle = "",
  isIcon = false, // Whether to show an icon instead of text
  icon, // Now accepting an `icon` name for Ionicons
  iconSize = 22, // Icon size
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled} // Disable button when loading or disabled
      className={`flex-row items-center justify-center py-2 px-5 rounded ${buttonStyle}`}
      style={{
        opacity: loading || disabled ? 0.6 : 1, // Button becomes semi-transparent when disabled or loading
      }}
    >
      {/* Show loading indicator when loading */}
      {loading ? (
        <ActivityIndicator size={iconSize} color="white" />
      ) : (
        isIcon ? (
          // Render Ionicons component with the icon name and size
          <Ionicons name={icon} size={iconSize} color="white" />
        ) : (
          // Show text if no icon is required
          <Text className={`${buttonStyle && 'text-white'} text-lg ${textStyle}`}>{title}</Text>
        )
      )}
    </TouchableOpacity>
  );
};

export default Button;
