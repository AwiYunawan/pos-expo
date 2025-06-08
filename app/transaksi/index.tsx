import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function TransaksiPage() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Transaksi',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Transaksi</Text>
        <Button title="Pilih Metode" onPress={() => router.push('/transaksi/metode')} />
      </View>
    </>
  );
}
