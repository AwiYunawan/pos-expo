import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { db } from "@/FirebaseConfig";
import { format } from "date-fns";

export default function DetailPemasukan() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const docRef = doc(db, "transaksi", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Memuat detail transaksi...</Text>
      </View>
    );
  }

  const waktuFormatted = format(data.waktu.toDate(), "dd MMMM yyyy HH:mm");

  return (
    <>
      <Stack.Screen options={{ title: "Detail Transaksi" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detail Transaksi</Text>
        <Text style={styles.subtext}>Waktu: {waktuFormatted}</Text>
        <Text style={styles.subtext}>Metode: {data.metode}</Text>
        <Text>Total Harga: Rp{data.totalHarga}</Text>
        <Text>Uang Dibayar: Rp{data.uangDibayar}</Text>
        <Text style={styles.kembalian}>Kembalian: Rp{data.kembalian}</Text>

        <Text style={styles.listTitle}>Rincian Pesanan:</Text>
        {data.items.map((item: any, idx: number) => {
          const harga = parseInt(item.harga) || 0;
          const quantity = parseInt(item.quantity) || 0;
          const subtotal = harga * quantity;

          return (
            <Text key={idx}>
              {item.nama} x{quantity} - Rp{subtotal.toLocaleString()}
            </Text>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    textAlign: "center",
    marginBottom: 10,
  },
  kembalian: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  listTitle: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
