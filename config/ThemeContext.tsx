import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, DarkTheme } from "react-native-paper";
import { Appearance } from "react-native";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: DefaultTheme,
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === "dark");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      theme: isDarkMode ? DarkTheme : DefaultTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
