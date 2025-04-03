import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const ExpenseList = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Daftar Pengeluaran</Text>
      <Button title="Lihat Detail Pengeluaran" onPress={() => router.push("/pengeluaran/detail")} />
    </View>
  );
};

export default ExpenseList;
