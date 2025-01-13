import { Stack } from "expo-router";
import {Provider} from 'react-redux';
import { store } from "@/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppSelector } from "@/redux/hooks";

function App() {
  const { user } = useAppSelector(state => state.auth);

  return (
    <SafeAreaProvider>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false,
          headerTintColor: '#000',
          headerTransparent: true,
          headerTitle: ''
          }}
          initialRouteName="index"
        >
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }}/> 
        </Stack>
    </SafeAreaProvider>
  )
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
}
