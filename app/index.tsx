import { Pressable, Text, View } from "react-native";
import { Link } from 'expo-router';

export default function MainPage() {
  return (
    <View
      className="flex-1 justify-center items-center"
    >
      <Text className="text-red-600 text-2xl">Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/login"} className="w-full border border-red-500 h-10 ">
        <Pressable className="py-1 px-3 rounded-sm border border-red-500">
          <Text>Login</Text>
        </Pressable>
       </Link>
    </View>
  );
}
