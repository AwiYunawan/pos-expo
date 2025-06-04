// app/screens/pengeluaran/PengeluaranPage.tsx
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../FirebaseConfig";

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
  await updateDoc(laporanRef, {
    pengeluaran: jumlah,
  }).catch(async () => {
    await setDoc(laporanRef, { pengeluaran: jumlah, waktu });
  });

  return docRef;
};

const updatePengeluaran = async (id: string, jumlah: number, keterangan: string) => {
  const waktu = Timestamp.now();
  await updateDoc(doc(db, "pengeluaran", id), { jumlah, keterangan, waktu });
};

const deletePengeluaran = async (id: string) => {
  await deleteDoc(doc(db, "pengeluaran", id));
};

// --- Main Page Component ---
export default function PengeluaranPage() {
  const [data, setData] = useState<any[]>([]);
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

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
      if (editingId) {
        await updatePengeluaran(editingId, jml, keterangan);
        Alert.alert("Berhasil", "Pengeluaran diperbarui");
      } else {
        await addPengeluaran(jml, keterangan);
        Alert.alert("Berhasil", "Pengeluaran disimpan");
      }

      setJumlah("");
      setKeterangan("");
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (item: any) => {
    setJumlah(item.jumlah.toString());
    setKeterangan(item.keterangan);
    setEditingId(item.id);
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
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.subtitle}>{editingId ? "Edit" : "Tambah"} Pengeluaran</Text>
        <TextInput placeholder="Jumlah (Rp)" keyboardType="numeric" value={jumlah} onChangeText={setJumlah} style={styles.input} />
        <TextInput placeholder="Keterangan" value={keterangan} onChangeText={setKeterangan} style={styles.input} />
        <Button title={editingId ? "Perbarui" : "Simpan"} onPress={handleSubmit} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Rp {item.jumlah}</Text>
            <Text>{item.keterangan}</Text>
            <Text>{new Date(item.waktu.seconds * 1000).toLocaleString()}</Text>
            <View style={styles.buttonGroup}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Hapus" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

// --- Styling ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  list: { marginBottom: 20 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  form: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
