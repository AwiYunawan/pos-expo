import { Stack } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function KalkulatorPage() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Kalkulator' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Halaman Kalkulator</Text>
        <Button title="Lanjut ke Receipt" onPress={() => router.push('/transaksi/receipt')} />
      </View>
    </>
  );
}