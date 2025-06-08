import { Stack } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function MetodePage() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Metode Pembayaran' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Metode Pembayaran</Text>
        <Button title="Lanjut ke Kalkulator" onPress={() => router.push('/transaksi/kalkulator')} />
      </View>
    </>
  );
}
