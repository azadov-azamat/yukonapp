import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  MD3LightTheme,
  MD3DarkTheme
} from "react-native-paper";
import { Appearance } from "react-native";

const defaultTheme = PaperDefaultTheme || {
  colors: {
    primary: "#3498db",
    background: "#ffffff",
    text: "#333333",
  },
};

const LightTheme = {
  ...defaultTheme,
  colors: {
    ...(defaultTheme.colors || {}),
    // primary: "#3498db",
    // background: "#ffffff",
  },
  customStyles: {}
};

const DarkTheme = {
  ...(PaperDarkTheme || defaultTheme),
  colors: {
    ...(PaperDarkTheme?.colors || defaultTheme.colors),
    // primary: "#FF5733",
    // background: "#121212",
  },
  customStyles: {}
};

// ✅ Create ThemeContext with default values
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: LightTheme,
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
      theme: isDarkMode ? DarkTheme : LightTheme
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
