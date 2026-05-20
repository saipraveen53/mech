import { SafeAreaView, StatusBar } from 'react-native';
import ProfileScreen from '../profile/index';

export default function ProfileTabScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <ProfileScreen />
    </SafeAreaView>
  );
}