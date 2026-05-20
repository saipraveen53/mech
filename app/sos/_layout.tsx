import { Stack } from 'expo-router';
import { SafeAreaView, StatusBar } from 'react-native';

export default function SOSLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </>
  );
}