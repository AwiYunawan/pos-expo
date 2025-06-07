import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const CalculatorScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Kalkulator Pembayaran</Text>
      <Button title="Lanjut ke Struk" onPress={() => router.push("/transaksi/receipt")} />
    </View>
  );
};

export default CalculatorScreen;
