import { db } from "@/FirebaseConfig";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface LaporanData {
  id: string;
  jumlahTransaksi: number;
  masukRekening: number;
  masukToko: number;
  pengeluaran: number;
  waktu?: any; // gunakan Timestamp jika diimpor dari Firebase
  menuTerjual?: Record<string, number>;
}


export default function LaporanPage() {
  const [laporanList, setLaporanList] = useState<LaporanData[]>([]);

  useEffect(() => {
    const fetchLaporan = async () => {
      const querySnapshot = await getDocs(collection(db, "laporan"));
      const data: LaporanData[] = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          jumlahTransaksi: docData.jumlahTransaksi ?? 0,
          masukRekening: docData.masukRekening ?? 0,
          masukToko: docData.masukToko ?? 0,
          pengeluaran: docData.pengeluaran ?? 0,
          waktu: docData.waktu,
          menuTerjual: docData.menuTerjual ?? {},
        };
      });
      data.sort((a, b) => {
        const waktuA = a.waktu?.toDate?.() || new Date(a.id);
        const waktuB = b.waktu?.toDate?.() || new Date(b.id);
        return waktuB.getTime() - waktuA.getTime();
      });
      setLaporanList(data);
    };

    fetchLaporan();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Laporan",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <FlatList
        data={laporanList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>📅 {item.id}</Text>
            <Text>🧾 Jumlah Transaksi: {item.jumlahTransaksi}</Text>
            <Text>💰 Masuk Toko: Rp{item.masukToko.toLocaleString()}</Text>
            <Text>🏦 Masuk Rekening: Rp{item.masukRekening.toLocaleString()}</Text>
            <Text>📉 Pengeluaran: Rp{item.pengeluaran.toLocaleString()}</Text>

            <Text style={styles.menuHeader}>🍽️ Menu Terjual:</Text>
            {item.menuTerjual &&
              Object.entries(item.menuTerjual).map(([nama, jumlah]: [string, any]) => (
                <Text key={nama}>
                  - {nama}: {jumlah}x
                </Text>
              ))}
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  date: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  menuHeader: {
    marginTop: 10,
    fontWeight: "bold",
  },
});
