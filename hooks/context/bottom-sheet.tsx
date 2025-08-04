import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import SettingsBottomSheet, { SettingsBottomSheetRef } from "@/components/bottom-sheet/settings";
import EditFormBottomSheet, { EditFormBottomSheetRef } from "@/components/bottom-sheet/edit-form";
import LoadViewBottomSheet, { LoadViewBottomSheetRef } from '@/components/bottom-sheet/load-view';
import VehicleViewBottomSheet, { VehicleViewBottomSheetRef } from '@/components/bottom-sheet/vehicle-view';
import LanguageBottomSheet, { LanguageBottomSheetRef, languages } from '@/components/bottom-sheet/language';
import LoadFilterBottomSheet, { LoadFilterBottomSheetRef } from '@/components/bottom-sheet/load-filter';

type AppContextType = {
  openLoadFilter: (filters: any[], onChange: () => void) => void;
  closeLoadFilter: () => void;
  selectedFilters: any[];
  onFilterChange: (value: string) => void;

  openSettings: () => void;
  openEditForm: (id: number, model: 'load' | 'vehicle') => void;
  openLoadView: () => void;
  openVehicleView: () => void;
  openLanguage: () => void;
  languages: Array<{ code: string; label: string; icon: any; short: string }>;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {

  const [selectedFilters, setSelectedFilters] = useState<any>([]);
  const [onFilterChange, setOnFilterChange] = useState<() => void>(() => {});


  const settingsSheetRef = useRef<SettingsBottomSheetRef>(null);
  const openSettings = useCallback(() => settingsSheetRef.current?.open(), []);

  // Edit Load Bottom Sheet
  const EditFormSheetRef = useRef<EditFormBottomSheetRef>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [model, setModel] = useState<'load' | 'vehicle'>('load');
  const openEditForm = useCallback((id: number, model: 'load' | 'vehicle') => {
    EditFormSheetRef.current?.open();
    setRecordId(id);
    setModel(model);
  }, []);

  // Load filter Bottom Sheet
  const LoadFilterSheetRef = useRef<LoadFilterBottomSheetRef>(null);
  const closeLoadFilter = useCallback(() => {
    LoadFilterSheetRef.current?.close();
  }, []);
  const openLoadFilter = useCallback(
    (filters: any[], onChange: () => void) => {
      setSelectedFilters(filters);
      setOnFilterChange(() => onChange); // funktsiyani holatda saqlaymiz
      LoadFilterSheetRef.current?.open();
    },
    []
  );


  // Load View Bottom Sheet
  const LoadViewSheetRef = useRef<LoadViewBottomSheetRef>(null);
  const openLoadView = useCallback(() => LoadViewSheetRef.current?.open(), []);

  // Vehicle View Bottom Sheet
  const VehicleViewSheetRef = useRef<VehicleViewBottomSheetRef>(null);
  const openVehicleView = useCallback(() => VehicleViewSheetRef.current?.open(), []);

  // Language Bottom Sheet
  const LanguageSheetRef = useRef<LanguageBottomSheetRef>(null);
  const openLanguage = useCallback(() => LanguageSheetRef.current?.open(), []);
  
  return (
    <AppContext.Provider value={{ 
                            openSettings, 
                            openEditForm, 
                            openLoadView, 
                            openVehicleView, 
                            openLanguage, 
                            languages, 
                            openLoadFilter, 
                            selectedFilters, 
                            onFilterChange,
                            closeLoadFilter
                          }}>
      {children}
      <MemoizedSettingsBottomSheet ref={settingsSheetRef} />
      <MemoizedEditFormBottomSheet ref={EditFormSheetRef} recordId={recordId} model={model} />
      <MemoizedLoadViewBottomSheet ref={LoadViewSheetRef} />
      <MemoizedVehicleViewBottomSheet ref={VehicleViewSheetRef} />
      <MemoizedLanguageBottomSheet ref={LanguageSheetRef} />
      <MemoizedLoadFilterBottomSheet ref={LoadFilterSheetRef} />
    </AppContext.Provider>
  );
}

const MemoizedSettingsBottomSheet = React.memo(SettingsBottomSheet);
const MemoizedEditFormBottomSheet = React.memo(EditFormBottomSheet);
const MemoizedLoadViewBottomSheet = React.memo(LoadViewBottomSheet);
const MemoizedVehicleViewBottomSheet = React.memo(VehicleViewBottomSheet);
const MemoizedLanguageBottomSheet = React.memo(LanguageBottomSheet);
const MemoizedLoadFilterBottomSheet = React.memo(LoadFilterBottomSheet);

export function useBottomSheet() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}
