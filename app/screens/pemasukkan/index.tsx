import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function PemasukkanPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Pemasukkan',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Pemasukkan</Text>
      </View>
    </>
  );
}
