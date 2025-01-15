import { Image, View } from "react-native";
import LoginForm from '@/components/forms/login';

export default function MainPage() {
  
  return (
    <View className='items-center justify-center flex-1 bg-gray-100'>
      {/* Logo */}
        {/* <Image
          source={require('@/assets/images/logo.png')} // O'zingizning logotipingizni joylashtiring
          className='w-1/2 '
        /> */}
      {/* Form */}
      <LoginForm />
    </View>
  );
}
