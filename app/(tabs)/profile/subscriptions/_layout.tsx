import React from 'react';
import { Stack } from 'expo-router';

export default function SubscriptionsLayout() {
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
