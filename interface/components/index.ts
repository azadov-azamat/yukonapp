import { TextInputProps } from "react-native";

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