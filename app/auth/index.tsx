import { View, Alert, TouchableOpacity, Text } from "react-native";
import React from "react";
import { CustomLanguageSelector } from "@/components/custom";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/config/ThemeContext';
import { styled } from "nativewind";
import { RegisterForm, LoginForm, ResetPasswordForm } from "@/components/forms";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function MainPage() {
  const {t} = useTranslation();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  const [view, setView] = React.useState("login")
  
  return (
    <StyledView className="flex-1 w-full p-6 bg-primary-light dark:bg-primary-dark">
      <StyledView className="flex-row items-center justify-between mt-5">
           {/* Language Selector */}
        <CustomLanguageSelector />

        <StyledView className="ml-2"> 
            <StyledTouchableOpacity
              onPress={toggleTheme}
              className={`w-10 h-10 items-center justify-center rounded-full shadow-md ${isDarkMode ? 'bg-primary-bg-dark' : 'bg-primary-bg-light'}`}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={theme.colors[!isDarkMode ? 'dark' : 'light']}
              />
            </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledView className="mt-10">
        <StyledView className={`${view === 'forgot-password' ? 'flex-col items-center justify-center' : 'flex-row items-center justify-between'} mb-10`}>
          <StyledText className="text-2xl font-bold text-primary-black dark:text-primary-light">
            {t(view === "login" ? "login" : view === "register" ? "register" : "forgot-password")}
          </StyledText>
          {
            view === "forgot-password" ? (
              <StyledText className="mt-3 text-sm leading-6 text-center text-text-color">
                {t("forgot-password-description")}
              </StyledText>
            ) : ( 
              <StyledTouchableOpacity
                onPress={() => setView(view === "login" ? "register" : "login")}
          >
            <StyledText className="font-medium text-primary">
              {t(view === "login" ? "register" : "login" )}
              </StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>
        
        {view === "login" ? <LoginForm setView={setView} /> : 
            view === "register" ? <RegisterForm setView={setView} /> : 
            <ResetPasswordForm setView={setView} />
        }
      </StyledView>
    </StyledView>
  );
}
