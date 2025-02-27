import React, { createContext, useContext, useRef, useState } from 'react';
import SettingsBottomSheet, { SettingsBottomSheetRef } from "@/components/bottom-sheet/settings";
import EditLoadBottomSheet, { EditLoadBottomSheetRef } from "@/components/bottom-sheet/edit-load";
import LoadViewBottomSheet, { LoadViewBottomSheetRef } from '@/components/bottom-sheet/load-view';

type AppContextType = {
  openSettings: () => void;
  openEditLoad: (id: number) => void;
  openLoadView: (id: number) => void;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const settingsSheetRef = useRef<SettingsBottomSheetRef>(null);
  const openSettings = () => settingsSheetRef.current?.open();

  // Edit Load Bottom Sheet
  const EditLoadSheetRef = useRef<EditLoadBottomSheetRef>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const openEditLoad = (id: number) => {
    setRecordId(id);
    EditLoadSheetRef.current?.open();
  };

  // Load Vehicle View Bottom Sheet
  const LoadViewSheetRef = useRef<LoadViewBottomSheetRef>(null);
  const openLoadView = (id: number) => {
    LoadViewSheetRef.current?.open();
    setRecordId(id);
  }

  return (
    <AppContext.Provider value={{ openSettings, openEditLoad, openLoadView }}>
      {children}
      <SettingsBottomSheet ref={settingsSheetRef} />
      <EditLoadBottomSheet ref={EditLoadSheetRef} recordId={recordId} />
      <LoadViewBottomSheet ref={LoadViewSheetRef} recordId={recordId} />
    </AppContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}
