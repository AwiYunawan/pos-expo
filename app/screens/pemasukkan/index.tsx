import { db , } from "@/FirebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { format, isSameDay } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Timestamp } from "firebase/firestore";


export default function PemasukanIndex() {
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTransaksi();
  }, []);
  type Transaksi = {
    id: string;
    waktu: Timestamp; // atau Timestamp dari Firebase modular
    // tambahkan properti lain kalau ada, misalnya jumlah, metodePembayaran, dll
  };

  const fetchTransaksi = async () => {
    const querySnapshot = await getDocs(collection(db, "transaksi"));
    const data: Transaksi[] = querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Transaksi)
      ) // <--- casting tiap item jadi tipe Transaksi
      .sort((a, b) => b.waktu.toDate().getTime() - a.waktu.toDate().getTime());

    setTransaksiList(data);
    setFilteredList(data);
  };

  const filterByDate = (date: Date) => {
    const filtered = transaksiList.filter((item) => isSameDay(item.waktu.toDate(), date));
    setFilteredList(filtered);
  };

  const handleDelete = async (transaksi: any) => {
    const confirm = await new Promise((resolve) => {
      Alert.alert("Hapus Transaksi", "Apakah kamu yakin ingin menghapus transaksi ini?", [
        { text: "Batal", style: "cancel", onPress: () => resolve(false) },
        { text: "Hapus", style: "destructive", onPress: () => resolve(true) },
      ]);
    });

    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "transaksi", transaksi.id));

      const tanggal = format(transaksi.waktu.toDate(), "yyyy-MM-dd");
      const laporanRef = doc(db, "laporan", tanggal);
      const laporanSnap = await getDoc(laporanRef);

      if (laporanSnap.exists()) {
        const laporanData = laporanSnap.data();
        const menuTerjual = { ...laporanData.menuTerjual };

        transaksi.items.forEach((item: any) => {
          const nama = item.nama;
          if (menuTerjual[nama]) {
            menuTerjual[nama] -= item.quantity;
            if (menuTerjual[nama] <= 0) delete menuTerjual[nama];
          }
        });

        await updateDoc(laporanRef, {
          jumlahTransaksi: Math.max((laporanData.jumlahTransaksi || 1) - 1, 0),
          [`masuk${transaksi.metode === "QRIS" ? "Rekening" : "Toko"}`]: Math.max((laporanData[`masuk${transaksi.metode === "QRIS" ? "Rekening" : "Toko"}`] || 0) - (transaksi.totalHarga || 0), 0),
          menuTerjual,
        });
      }

      fetchTransaksi();
    } catch (error) {
      console.error("Gagal menghapus transaksi:", error);
    }
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setFilterDate(selectedDate);
      filterByDate(selectedDate);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pemasukkan",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Daftar Transaksi</Text>

        <View style={styles.filterContainer}>
          <Button title={filterDate ? `Filter: ${format(filterDate, "dd MMM yyyy")}` : "Pilih Tanggal"} onPress={() => setShowPicker(true)} />
          {filterDate && (
            <Button
              title="Reset Filter"
              onPress={() => {
                setFilterDate(null);
                setFilteredList(transaksiList);
              }}
              color="gray"
            />
          )}
        </View>

        {showPicker && <DateTimePicker value={filterDate || new Date()} mode="date" display={Platform.OS === "ios" ? "inline" : "default"} onChange={onDateChange} />}

        <FlatList
          data={filteredList}
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
                <Text style={styles.date}>{format(item.waktu.toDate(), "dd MMM yyyy HH:mm")}</Text>
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
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
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
