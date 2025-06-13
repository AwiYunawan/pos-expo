import { db } from "@/FirebaseConfig";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { format } from "date-fns";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

export default function PemasukanIndex() {
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    const querySnapshot = await getDocs(collection(db, "transaksi"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTransaksiList(data);
  };

  const handleDelete = async (transaksi: any) => {
    const confirm = await new Promise((resolve) => {
      Alert.alert(
        "Hapus Transaksi",
        "Apakah kamu yakin ingin menghapus transaksi ini?",
        [
          { text: "Batal", style: "cancel", onPress: () => resolve(false) },
          { text: "Hapus", style: "destructive", onPress: () => resolve(true) },
        ]
      );
    });

    if (!confirm) return;

    try {
      // 1. Hapus transaksi
      await deleteDoc(doc(db, "transaksi", transaksi.id));

      // 2. Update laporan
      const tanggal = format(transaksi.waktu.toDate(), "yyyy-MM-dd");
      const laporanRef = doc(db, "laporan", tanggal);
      const laporanSnap = await getDoc(laporanRef);

      if (laporanSnap.exists()) {
        const laporanData = laporanSnap.data();
        const menuTerjual = { ...laporanData.menuTerjual };

        // Kurangi quantity tiap menu
        transaksi.items.forEach((item: any) => {
          const nama = item.nama;
          if (menuTerjual[nama]) {
            menuTerjual[nama] -= item.quantity;
            if (menuTerjual[nama] <= 0) delete menuTerjual[nama];
          }
        });

        await updateDoc(laporanRef, {
          jumlahTransaksi: Math.max((laporanData.jumlahTransaksi || 1) - 1, 0),
          [`masuk${transaksi.metode === "QRIS" ? "Rekening" : "Toko"}`]: Math.max(
            (laporanData[`masuk${transaksi.metode === "QRIS" ? "Rekening" : "Toko"}`] || 0) -
              (transaksi.totalHarga || 0),
            0
          ),
          menuTerjual,
        });
      }

      // Refresh data
      fetchTransaksi();
    } catch (error) {
      console.error("Gagal menghapus transaksi:", error);
    }
  };

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
            <View style={styles.card}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  router.push({
                    pathname: "/screens/pemasukkan/detail",
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.date}>
                  {format(item.waktu.toDate(), "dd MMM yyyy HH:mm")}
                </Text>
                <Text>Total: Rp{item.totalHarga}</Text>
                <Text>Metode: {item.metode}</Text>
              </TouchableOpacity>
              <Button title="Hapus" color="red" onPress={() => handleDelete(item)} />
            </View>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontWeight: "bold",
  },
});
