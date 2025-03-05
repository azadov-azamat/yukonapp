import { RelativePathString, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import CustomHeader from "@/components/custom/header";

export default function AdsLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: true }}>
     <Stack.Screen
        name="[edit-create]"
        options={() => {
          const params = useLocalSearchParams(); 
          const param = params['edit-create'];

          return {
            animation: "slide_from_left",
            header: () => (
              <CustomHeader
                title={param === 'create' ? t ("pages.create-add") : t ("pages.just-edit")}
                goToRoute={"/" as RelativePathString}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
