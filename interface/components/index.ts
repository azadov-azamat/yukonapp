import LoadModel from "@/models/load";
import VehicleModel from "@/models/vehicle";
import { Ionicons } from "@expo/vector-icons";
import { ExternalPathString, RelativePathString } from "expo-router";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

export interface InputProps extends TextInputProps {
    label?: string | null; // Optional label
    value: string; // Input qiymati
    onChangeText: (text: string) => void; // Matn o'zgarishi uchun callback
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void; // Blur callback
    placeholder?: string; // Placeholder matni
    error?: string | null; // Xatolik matni
    type?: 'text' | 'phone' | 'password' | `expiry` | `card`; // Input turi
    loading?: boolean; // Yuklanish indikatori
    divClass?: string;
  }

export interface ButtonComponentProps {
    title?: string; // Tugma matni
    onPress: () => void; // Bosilganda chaqiriladigan funksiya
    loading?: boolean; // Yuklanish holati (ixtiyoriy, default: false)
    disabled?: boolean; // Tugma faol yoki yo'qligi (ixtiyoriy, default: false)
    buttonStyle?: string | StyleProp<ViewStyle>; // Tugma uslubi
    textStyle?: string | StyleProp<TextStyle>; // Matn uslubi
    isIcon?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
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

export interface DirectionItemProps {
    origin: {id: number; name_uz: string; name_ru: string};
    destination: {id: number; name_uz: string; name_ru: string};
    total_loads: number;
    today_loads: number;
}

export interface ModalItemProps {
    open: boolean;
    toggle: (item?: boolean) => void;
    children?: React.ReactNode;
}

export interface loadCardInterfaceProps {
    load: LoadModel,
    onPress?: () => void;
    showElement?: boolean;
    close?: () => void;
    isUpdate?: boolean;
}

export interface vehicleCardInterfaceProps {
    vehicle: VehicleModel,
    onPress?: () => void;
    showElement?: boolean;
    close?: () => void;
    isUpdate?: boolean;
}

export interface HeaderProps {
    title: string; // Title of the header
    goToRoute: RelativePathString | ExternalPathString; // Route to navigate when back button is clicked
}

export interface InputSelectorProps<T> {
  label?: string;
  value: any;
  onChange: (value: string) => void;
  clearValue?: () => void;
  placeholder: string;
  error?: string;
  type?: string;
  divClass?: string;
  loading?: boolean;
  disabled?: boolean;
  rightData?: (item: T) => React.ReactElement | null;
  rowItem: (item: T) => React.ReactElement | null;
  [key: string]: any; // This allows passing other props like style, etc.
}
