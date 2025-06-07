import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const PaymentScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pilih Metode Pembayaran</Text>
      <Button title="Lanjut ke Kalkulator" onPress={() => router.push("/transaksi/calculator")} />
    </View>
  );
};

export default PaymentScreen;
