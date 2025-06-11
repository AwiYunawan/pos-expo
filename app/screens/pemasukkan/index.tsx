import { db } from "@/FirebaseConfig";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { format } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PemasukanIndex() {
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTransaksi = async () => {
      const querySnapshot = await getDocs(collection(db, "transaksi"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransaksiList(data);
    };

    fetchTransaksi();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transaksi",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Daftar Transaksi</Text>
        <FlatList
          data={transaksiList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/screens/pemasukkan/detail", params: { id: item.id } })}>
              <Text style={styles.date}>{format(item.waktu.toDate(), "dd MMM yyyy HH:mm")}</Text>
              <Text>Total: Rp{item.totalHarga}</Text>
              <Text>Metode: {item.metode}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  date: {
    fontWeight: "bold",
  },
});
