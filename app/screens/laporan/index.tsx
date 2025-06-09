import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function LaporanPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Laporan',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Laporan</Text>
      </View>
    </>
  );
}
