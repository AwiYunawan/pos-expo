// app/screens/pengeluaran/PengeluaranPage.tsx
import { addDoc, collection, deleteDoc, doc, getDocs, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../../FirebaseConfig";

// --- Service Functions ---
const pengeluaranRef = collection(db, "pengeluaran");

const getAllPengeluaran = async () => {
  const snapshot = await getDocs(pengeluaranRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addPengeluaran = async (jumlah: number, keterangan: string) => {
  const waktu = Timestamp.now();
  const docRef = await addDoc(pengeluaranRef, { jumlah, keterangan, waktu });

  const today = new Date().toISOString().split("T")[0];
  const laporanRef = doc(db, "laporan", today);

  const laporanSnapshot = await getDoc(laporanRef);
  if (laporanSnapshot.exists()) {
    const current = laporanSnapshot.data().pengeluaran || 0;
    await updateDoc(laporanRef, {
      pengeluaran: current + jumlah,
    });
  } else {
    await setDoc(laporanRef, { pengeluaran: jumlah, waktu });
  }

  return docRef;
};


const deletePengeluaran = async (id: string) => {
  const pengeluaranDoc = doc(db, 'pengeluaran', id);
  const snapshot = await getDoc(pengeluaranDoc);

  if (!snapshot.exists()) return;

  const { jumlah, waktu } = snapshot.data();
  const tanggal = new Date(waktu.seconds * 1000).toISOString().split('T')[0];
  const laporanRef = doc(db, 'laporan', tanggal);

  const laporanSnapshot = await getDoc(laporanRef);
  if (laporanSnapshot.exists()) {
    const current = laporanSnapshot.data().pengeluaran || 0;
    const updated = current - jumlah;

    if (updated <= 0) {
      await updateDoc(laporanRef, { pengeluaran: 0 });
    } else {
      await updateDoc(laporanRef, { pengeluaran: updated });
    }
  }

  await deleteDoc(pengeluaranDoc);
};

// --- Main Page Component ---
export default function PengeluaranPage() {
  const [data, setData] = useState<any[]>([]);
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const items = await getAllPengeluaran();
    setData(items);
  };

  const handleSubmit = async () => {
    const jml = parseInt(jumlah);
    if (!jml || !keterangan) {
      Alert.alert("Validasi", "Jumlah dan keterangan harus diisi");
      return;
    }

    try {
      await addPengeluaran(jml, keterangan);
      Alert.alert("Berhasil", "Pengeluaran disimpan");

      setJumlah("");
      setKeterangan("");
      fetchData();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Konfirmasi", "Hapus pengeluaran ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          await deletePengeluaran(id);
          fetchData();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <>
    <Stack.Screen
        options={{
          title: 'Pengeluaran',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Tambah Pengeluaran</Text>
        <TextInput placeholder="Jumlah (Rp)" keyboardType="numeric" value={jumlah} onChangeText={setJumlah} style={styles.input} />
        <TextInput placeholder="Keterangan" value={keterangan} onChangeText={setKeterangan} style={styles.input} />
        <Button title="Simpan" onPress={handleSubmit} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.jumlah}>Rp {item.jumlah}</Text>
                <Text style={styles.keterangan}>{item.keterangan}</Text>
                <Text style={styles.waktu}>{new Date(item.waktu.seconds * 1000).toLocaleString()}</Text>
              </View>
              <Button title="Hapus" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
    </>
  );
}

// --- Styling ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  list: { marginBottom: 20 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flexShrink: 1,
    marginRight: 10,
  },
  jumlah: {
    fontWeight: "bold",
    fontSize: 16,
  },
  keterangan: {
    fontSize: 14,
  },
  waktu: {
    fontSize: 12,
    color: "#666",
  },
  form: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
