import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
}

const CustomIconButton: React.FC<IconButtonProps> = ({ icon, onPress, style }) => {
  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      style={[{...styles.iconButton}, style]}
      iconColor="white" // ✅ White icon color
      size={24}
      mode="contained-tonal" // ✅ Background appears only on press
    />
  );
};

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: 50, // Circular shape
    backgroundColor: 'transparent', // No background by default
    elevation: 0, // ✅ No shadow for Android
    shadowColor: 'transparent', // ✅ No shadow for iOS
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default CustomIconButton;
