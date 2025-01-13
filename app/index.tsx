import { View } from "react-native";
import LoginForm from '@/components/forms/login';

export default function MainPage() {
  
  return (
    <View className='items-center justify-center flex-1 bg-gray-100'>
      {/* Logo */}
      {/* <Image
        source={{ uri: 'https://example.com/logo.png' }} // O'zingizning logotipingizni joylashtiring
        style={tailwind('w-20 h-20 mb-6')}
      /> */}
      {/* Form */}
      <LoginForm />
    </View>
  );
}
