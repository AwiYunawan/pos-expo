import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function KategoriPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Kategori',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Kategori</Text>
      </View>
    </>
  );
}
