import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DefaultTheme as PaperDefaultTheme,
  MD3LightTheme,
  MD3DarkTheme
} from "react-native-paper";
import { Appearance } from "react-native";
import { useColorScheme } from "nativewind";
import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";

const defaultTheme = {
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#623BFF",
    text: "#333333",
    purple: 'rgba(126,34,206,1.00)',
    dark: "#000000",
    light: "#ffffff",
    icon: 'rgb(156, 163, 175)',
    red: 'rgb(239, 68, 68)',
    inputColor: '#999999',
  },
};

const LightTheme = {
  ...defaultTheme,
  colors: {
    ...(defaultTheme.colors || {}),
    background: "#ffffff",
    border: "#e5e7eb",
    inputColor: '#999999',
    cardBackground: '#f5f5f5',
    iconTheme: '#222222',
  },
  customStyles: {}
};

const DarkTheme = {
  ...defaultTheme,
  colors: {
    ...(defaultTheme?.colors || {}),
    background: "#121212",
    border: "#D1D5DB",
    inputColor: '#999999',
    cardBackground: '#222222',
    iconTheme: '#f5f5f5',
  },
  customStyles: {}
};

// ✅ Create ThemeContext with default values
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: LightTheme,
  themeName: "dark"
});

// Add this function before the ThemeProvider
const applyThemeVariables = (theme: typeof LightTheme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, String(value));
    });
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === "dark");
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
        setColorScheme(savedTheme as ColorSchemeSystem);
      }
    };
    loadTheme();
  }, []);

  // Add this useEffect to apply CSS variables when theme changes
  useEffect(() => {
    const currentTheme = isDarkMode ? DarkTheme : LightTheme;
    applyThemeVariables(currentTheme);
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    const themeName = newTheme ? "dark" : "light";
    setIsDarkMode(newTheme);
    setColorScheme(themeName);
    await AsyncStorage.setItem("theme", themeName);    
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      theme: isDarkMode ? DarkTheme : LightTheme,
      themeName: isDarkMode ? "dark" : "light"
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
