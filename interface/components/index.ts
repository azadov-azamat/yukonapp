import { Ionicons } from "@expo/vector-icons";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

export interface InputProps extends TextInputProps {
    label?: string | null; // Optional label
    value: string; // Input qiymati
    onChangeText: (text: string) => void; // Matn o'zgarishi uchun callback
    onBlur?: () => void; // Blur callback
    placeholder?: string; // Placeholder matni
    error?: string | null; // Xatolik matni
    type?: 'text' | 'phone' | 'password'; // Input turi
    loading?: boolean; // Yuklanish indikatori
    divClass?: string;
  }

export interface ButtonProps {
    title?: string; // Tugma matni
    onPress: () => void; // Bosilganda chaqiriladigan funksiya
    loading?: boolean; // Yuklanish holati (ixtiyoriy, default: false)
    disabled?: boolean; // Tugma faol yoki yo'qligi (ixtiyoriy, default: false)
    buttonStyle?: string | StyleProp<ViewStyle>; // Tugma uslubi
    textStyle?: string | StyleProp<TextStyle>; // Matn uslubi
    isIcon: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
}

export interface ViewSelectorProps {
    tabs: viewSelectorTabs[];
    selectedTab: string;
    onTabSelect: (id: string) => void;
}

export interface viewSelectorTabs {
    label: string, value: string, icon?: keyof typeof Ionicons.glyphMap
}

export interface BadgeSelectorProps {
    items: viewSelectorTabs[]; // Barcha badge ma'lumotlari
    selectedItems: string[]; // Tanlangan badge'lar ID ro'yxati
    onChange: (value: string) => void; // Badge tanlanganida chaqiriladigan callback
    className?: string;
  }