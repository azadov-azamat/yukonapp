import React from "react";
import { RelativePathString, useRouter } from "expo-router";
import { HeaderProps } from "@/interface/components"; // Import HeaderProps
import { useTheme } from "@/config/ThemeContext";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader: React.FC<HeaderProps> = ({ title, goToRoute, rightComponent, headerStyle }) => {
  const router = useRouter();
	const { isDarkMode } = useTheme();

  return (
    <Appbar.Header className="flex-row justify-between px-3 bg-primary-light dark:bg-primary-dark" style={headerStyle}>
      <Ionicons name="chevron-back" size={28} color={isDarkMode ? "white" : "black"} onPress={() => router.replace(goToRoute as RelativePathString)} />
      {/* <Appbar.BackAction onPress={() => router.replace(goToRoute as RelativePathString)} /> */}
      <Appbar.Content title={title} onPress={() => router.replace(goToRoute as RelativePathString)} />
      {/*<Appbar.Action icon="dots-vertical" onPress={() => router.replace(goToRoute)} />*/}
      {rightComponent}
    </Appbar.Header>
  )
};

export default CustomHeader;
