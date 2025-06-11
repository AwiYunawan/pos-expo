import { db } from "@/FirebaseConfig";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ReceiptPage() {
  const { items, metode, uangDibayar, totalHarga, kembalian } = useLocalSearchParams();
  const router = useRouter();
  const now = new Date();
  const waktuFormatted = format(now, "dd MMMM yyyy HH:mm");

  let parsedItems: any[] = [];

  try {
    const rawItems = JSON.parse(items as string);
    if (Array.isArray(rawItems)) {
      parsedItems = rawItems.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));
    } else {
      console.warn("Parsed items is not an array", rawItems);
    }
  } catch (err) {
    console.error("Gagal parse items:", err);
  }

  const bayar = parseInt(uangDibayar as string);
  const total = parseInt(totalHarga as string);
  const kembali = parseInt(kembalian as string);
  const metodeStr = metode?.toString() || "";

  useEffect(() => {
    const simpanData = async () => {
      const now = new Date();
      const tanggal = format(now, "yyyy-MM-dd");
      const waktu = now;

      // Siapkan data transaksi
      const transaksiData = {
        items: parsedItems,
        metode: metodeStr,
        uangDibayar: bayar,
        totalHarga: total,
        kembalian: kembali,
        waktu,
      };

      // Simpan ke collection transaksi
      await addDoc(collection(db, "transaksi"), transaksiData);

      // Persiapan update laporan
      const laporanRef = doc(db, "laporan", tanggal);
      const laporanSnap = await getDoc(laporanRef);

      const menuTerjualBaru: Record<string, number> = {};
      parsedItems.forEach((item: any) => {
        if (menuTerjualBaru[item.nama]) {
          menuTerjualBaru[item.nama] += item.quantity;
        } else {
          menuTerjualBaru[item.nama] = item.quantity;
        }
      });

      if (laporanSnap.exists()) {
        // Jika laporan hari ini sudah ada → update
        const existing = laporanSnap.data();

        const updatedMenu = { ...existing.menuTerjual };
        for (const [name, qty] of Object.entries(menuTerjualBaru)) {
          updatedMenu[name] = (updatedMenu[name] || 0) + qty;
        }

        await updateDoc(laporanRef, {
          jumlahTransaksi: increment(1),
          [`menuTerjual`]: updatedMenu,
          [`masuk${metodeStr === "QRIS" ? "Rekening" : "Toko"}`]: increment(total),
          waktu,
        });
      } else {
        // Jika belum ada → buat dokumen baru
        await setDoc(laporanRef, {
          jumlahTransaksi: 1,
          masukRekening: metodeStr === "QRIS" ? total : 0,
          masukToko: metodeStr === "Tunai" ? total : 0,
          menuTerjual: menuTerjualBaru,
          pengeluaran: 0,
          waktu,
        });
      }
    };

    simpanData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Struk Transaksi" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pembayaran Berhasil</Text>
        <Text style={styles.subtext}>Waktu Transaksi: {waktuFormatted}</Text>

        <Text style={styles.subtext}>Metode: {metodeStr}</Text>
        <Text>Total Harga: Rp{total}</Text>
        <Text>Uang Dibayar: Rp{bayar}</Text>
        <Text style={styles.kembalian}>Kembalian: Rp{kembali}</Text>

        <Text style={styles.listTitle}>Rincian Pesanan:</Text>
        {parsedItems.map((item: any, idx: number) => {
          const harga = parseInt(item.harga) || 0;
          const quantity = parseInt(item.quantity) || 0;
          const subtotal = harga * quantity;

          return (
            <Text key={idx}>
              {item.nama} x{quantity} - Rp{subtotal.toLocaleString()}
            </Text>
          );
        })}

        <View style={{ marginTop: 30 }}>
          <Button title="Transaksi Baru" onPress={() => router.replace("/screens/transaksi")} />
        </View>
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
