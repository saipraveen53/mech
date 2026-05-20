import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </>
  );
}