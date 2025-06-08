import { Stack } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReceiptPage() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Struk Pembayaran' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Struk Pembayaran</Text>
        <Button title="Transaksi Baru" onPress={() => router.replace('/transaksi')} />
      </View>
    </>
  );
}