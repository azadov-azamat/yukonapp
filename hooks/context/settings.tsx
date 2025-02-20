import React, { createContext, useContext, useRef } from 'react';
import SettingsBottomSheet, { SettingsBottomSheetRef } from "@/components/bottom-sheet/settings";

type SettingsContextType = {
  openSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsSheetRef = useRef<SettingsBottomSheetRef>(null);

  const openSettings = () => {
    console.log('openSettings');
    settingsSheetRef.current?.open();
  };

  return (
    <SettingsContext.Provider value={{ openSettings }}>
      {children}
      <SettingsBottomSheet ref={settingsSheetRef} />
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}