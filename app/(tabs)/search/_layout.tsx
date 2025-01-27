import React from 'react';
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack 
      screenOptions={{
        gestureEnabled: false,
        header: () => {
          return null;
        },
      }}
      initialRouteName="index"
    />
  );
}
