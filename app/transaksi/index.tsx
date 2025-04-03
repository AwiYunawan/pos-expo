import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const TransactionHome = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Halaman Transaksi</Text>
      <Button title="Pilih Metode Pembayaran" onPress={() => router.push("/transaksi/payment")} />
    </View>
  );
};

export default TransactionHome;
