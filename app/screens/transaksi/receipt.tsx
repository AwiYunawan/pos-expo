import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, FlatList } from 'react-native';
import { useEffect } from 'react';
import { db } from '../../../FirebaseConfig';
import { addDoc, collection, setDoc, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';

export default function ReceiptPage() {
  const params = useLocalSearchParams();
  const { items, metode, uangDibayar, totalHarga, kembalian } = JSON.parse(Object.keys(params)[0]);
  const router = useRouter();

  useEffect(() => {
    const waktu = new Date();
    const transaksiData = {
      items,
      metode,
      uangDibayar,
      totalHarga,
      kembalian,
      waktu,
    };

    const saveData = async () => {
      const transaksiRef = await addDoc(collection(db, 'transaksi'), transaksiData);
      const tanggal = moment(waktu).format('YYYY-MM-DD');
      const laporanRef = doc(db, 'laporan', tanggal);

      const menuTerjual: any = {};
      items.forEach((item: any) => {
        if (menuTerjual[item.name]) {
          menuTerjual[item.name] += item.quantity;
        } else {
          menuTerjual[item.name] = item.quantity;
        }
      });

      await setDoc(
        laporanRef,
        {
          jumlahTransaksi: 1,
          [`menuTerjual`]: menuTerjual,
          pengeluaran: 0,
          waktu,
          masukRekening: metode === 'QRIS' ? totalHarga : 0,
          masukToko: metode === 'Tunai' ? totalHarga : 0,
        },
        { merge: true }
      );

      await updateDoc(laporanRef, {
        jumlahTransaksi: totalHarga > 0 ? 1 : 0,
        [`menuTerjual`]: menuTerjual,
      });
    };

    saveData();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Struk Transaksi' }} />
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Pembayaran Berhasil</Text>
        <Text>Metode: {metode}</Text>
        <Text>Total Harga: Rp{totalHarga}</Text>
        <Text>Uang Dibayar: Rp{uangDibayar}</Text>
        <Text>Kembalian: Rp{kembalian}</Text>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text>
              {item.name} x{item.quantity} = Rp{item.price * item.quantity}
            </Text>
          )}
        />
        <Button title="Transaksi Baru" onPress={() => router.replace('/screens/transaksi')} />
      </View>
    </>
  );
}
