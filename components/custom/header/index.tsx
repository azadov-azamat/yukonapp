import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { HeaderProps } from "@/interface/components"; // Import HeaderProps
import CustomButton from "../button";

const CustomHeader: React.FC<HeaderProps> = ({ title, goToRoute, rightComponent }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center py-2.5 px-4 bg-[#f8f9fa]">
      <CustomButton
        title="Back"
        onPress={() => router.push(goToRoute)}
        buttonStyle="bg-gray-200 px-3 py-1 rounded-md"
        textStyle="text-black"
        isIcon={true}
        icon="arrow-back"
        iconSize={24}
      />
      <Text className="flex-1 text-lg font-bold text-center capitalize">{title}</Text>
      {rightComponent}
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
    textTransform: 'capitalize'
  },
});

export default CustomHeader;
