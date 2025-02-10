import { View, Text, StyleSheet } from "react-native";
import { Slot } from "expo-router";

export default function AuthLayout() {
  return (
    <View className='relative items-center justify-center flex-1 bg-gray-100'>
      {/* Render the current auth screen */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
