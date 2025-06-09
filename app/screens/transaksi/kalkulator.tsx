import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function KalkulatorPage() {
  const { selected, metode } = useLocalSearchParams();
  const items = JSON.parse(selected as string);
  const totalHarga = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const [uang, setUang] = useState('');
  const router = useRouter();

  const handleBayar = () => {
    const bayar = parseInt(uang);
    if (isNaN(bayar) || bayar < totalHarga) {
      alert('Uang tidak cukup');
      return;
    }
    router.push({
      pathname: '/screens/transaksi/receipt',
      params: JSON.stringify({
        items,
        metode,
        uangDibayar: bayar,
        totalHarga,
        kembalian: bayar - totalHarga,
      }),
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Kalkulator' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Total: Rp{totalHarga}</Text>
        <TextInput
          placeholder="Uang dari pelanggan"
          keyboardType="numeric"
          value={uang}
          onChangeText={setUang}
          style={{ borderWidth: 1, padding: 10, width: 200, marginVertical: 20 }}
        />
        <Button title="Bayar" onPress={handleBayar} />
      </View>
    </>
  );
}
