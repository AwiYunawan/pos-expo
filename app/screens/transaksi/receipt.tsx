import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const ReceiptScreen = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Struk Pembayaran</Text>
      <Button title="Kembali ke Transaksi" onPress={() => router.replace("/transaksi")} />
      </View>
  );
};

export default ReceiptScreen;
