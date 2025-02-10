import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/custom/button"; // Import custom button
import { HeaderProps } from "@/interface/components"; // Import HeaderProps
import ArrowBackIcon from "@/assets/svg/arrow-back.svg";

const CustomHeader: React.FC<HeaderProps> = ({ title, goToRoute }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Button
        title="Back"
        onPress={() => router.push(goToRoute)} // Navigate to the given route
        buttonStyle="bg-gray-200 px-3 py-1 rounded-md" // Tailwind-like styles
        textStyle="text-black"
        isIcon={true} // Use an icon instead of text
        icon="arrow-back" // Pass the Ionicon name here
        iconSize={24}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomHeader;
