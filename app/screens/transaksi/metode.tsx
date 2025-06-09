import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function MetodePage() {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const [metode, setMetode] = useState<'Tunai' | 'QRIS' | null>(null);

  const lanjut = () => {
    if (!metode) return alert('Pilih metode pembayaran');
    router.push({
      pathname: '/screens/transaksi/kalkulator',
      params: {
        selected,
        metode,
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Metode Pembayaran' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pilih Metode:</Text>
        <TouchableOpacity onPress={() => setMetode('Tunai')} style={{ margin: 10 }}>
          <Text style={{ backgroundColor: metode === 'Tunai' ? 'green' : 'white', color: metode === 'Tunai' ? 'white' : 'black', padding: 10 }}>Tunai</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMetode('QRIS')} style={{ margin: 10 }}>
          <Text style={{ backgroundColor: metode === 'QRIS' ? 'green' : 'white', color: metode === 'QRIS' ? 'white' : 'black', padding: 10 }}>QRIS</Text>
        </TouchableOpacity>
        <Button title="Lanjut ke Kalkulator" onPress={lanjut} />
      </View>
    </>
  );
}
