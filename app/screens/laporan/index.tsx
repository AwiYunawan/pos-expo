import { db } from "@/FirebaseConfig";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface LaporanData {
  id: string;
  jumlahTransaksi: number;
  masukRekening: number;
  masukToko: number;
  pengeluaran: number;
  waktu?: any;
  menuTerjual?: Record<string, number>;
}

export default function LaporanPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const formatDateId = (date: Date) =>
    date.toISOString().split("T")[0]; // "yyyy-mm-dd"

  const fetchLaporanByDate = async (date: Date) => {
    const id = formatDateId(date);
    const docRef = doc(db, "laporan", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      setLaporan({
        id,
        jumlahTransaksi: data.jumlahTransaksi ?? 0,
        masukRekening: data.masukRekening ?? 0,
        masukToko: data.masukToko ?? 0,
        pengeluaran: data.pengeluaran ?? 0,
        waktu: data.waktu,
        menuTerjual: data.menuTerjual ?? {},
      });
    } else {
      setLaporan(null); // jika tidak ada data di tanggal itu
    }
  };

  useEffect(() => {
    fetchLaporanByDate(selectedDate);
  }, [selectedDate]);

  const onDateChange = (_event: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Laporan",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />

      <View style={styles.container}>
        <Button
          title={`Pilih Tanggal: ${formatDateId(selectedDate)}`}
          onPress={() => setShowPicker(true)}
        />
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}

        {laporan ? (
          <View style={styles.card}>
            <Text style={styles.date}>📅 {laporan.id}</Text>
            <Text>🧾 Jumlah Transaksi: {laporan.jumlahTransaksi}</Text>
            <Text>
              💰 Masuk Toko: Rp{laporan.masukToko.toLocaleString("id-ID")}
            </Text>
            <Text>
              🏦 Masuk Rekening: Rp{laporan.masukRekening.toLocaleString("id-ID")}
            </Text>
            <Text>
              📉 Pengeluaran: Rp{laporan.pengeluaran.toLocaleString("id-ID")}
            </Text>

            <Text style={styles.menuHeader}>🍽️ Menu Terjual:</Text>
            {laporan.menuTerjual &&
              Object.entries(laporan.menuTerjual).map(([nama, jumlah]) => (
                <Text key={nama}>- {nama}: {jumlah}x</Text>
              ))}
          </View>
        ) : (
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            Tidak ada data untuk tanggal ini.
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flex: 1,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
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
