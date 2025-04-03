import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const IncomeList = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Daftar Transaksi Pemasukan</Text>
      <Button title="Lihat Detail Transaksi" onPress={() => router.push("/pemasukan/detail")} />
    </View>
  );
};

export default IncomeList;
