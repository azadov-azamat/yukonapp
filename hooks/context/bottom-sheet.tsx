import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import SettingsBottomSheet, { SettingsBottomSheetRef } from "@/components/bottom-sheet/settings";
import EditLoadBottomSheet, { EditLoadBottomSheetRef } from "@/components/bottom-sheet/edit-load";
import LoadViewBottomSheet, { LoadViewBottomSheetRef } from '@/components/bottom-sheet/load-view';
import LanguageBottomSheet, { LanguageBottomSheetRef, languages } from '@/components/bottom-sheet/language';

type AppContextType = {
  openSettings: () => void;
  openEditLoad: (id: number) => void;
  openLoadView: () => void;
  openLanguage: () => void;
  languages: Array<{ code: string; label: string; icon: any; short: string }>;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const settingsSheetRef = useRef<SettingsBottomSheetRef>(null);
  const openSettings = useCallback(() => settingsSheetRef.current?.open(), []);

  // Edit Load Bottom Sheet
  const EditLoadSheetRef = useRef<EditLoadBottomSheetRef>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const openEditLoad = useCallback((id: number) => {
    EditLoadSheetRef.current?.open();
    setRecordId(id);
  }, []);

  // Load Vehicle View Bottom Sheet
  const LoadViewSheetRef = useRef<LoadViewBottomSheetRef>(null);
  const openLoadView = useCallback(() => LoadViewSheetRef.current?.open(), []);

  // Language Bottom Sheet
  const LanguageSheetRef = useRef<LanguageBottomSheetRef>(null);
  const openLanguage = useCallback(() => LanguageSheetRef.current?.open(), []);
  
  return (
    <AppContext.Provider value={{ openSettings, openEditLoad, openLoadView, openLanguage, languages }}>
      {children}
      <MemoizedSettingsBottomSheet ref={settingsSheetRef} />
      <MemoizedEditLoadBottomSheet ref={EditLoadSheetRef} recordId={recordId} />
      <MemoizedLoadViewBottomSheet ref={LoadViewSheetRef} />
      <MemoizedLanguageBottomSheet ref={LanguageSheetRef} />
    </AppContext.Provider>
  );
}

const MemoizedSettingsBottomSheet = React.memo(SettingsBottomSheet);
const MemoizedEditLoadBottomSheet = React.memo(EditLoadBottomSheet);
const MemoizedLoadViewBottomSheet = React.memo(LoadViewBottomSheet);
const MemoizedLanguageBottomSheet = React.memo(LanguageBottomSheet);

export function useBottomSheet() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}
