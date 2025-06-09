import { Picker } from "@react-native-picker/picker";
import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../../FirebaseConfig";

export default function KelolaMenu() {
  const [namaMenu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [kategoriList, setKategoriList] = useState<{ id: string; nama: string }[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKategori = async () => {
      const querySnapshot = await getDocs(collection(db, "kategori"));
      const data: { id: string; nama: string }[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, nama: doc.data().nama });
      });
      setKategoriList(data);
    };

    fetchKategori();
  }, []);

  const handleSubmit = async () => {
    if (!namaMenu || !harga || !selectedKategori) {
      Alert.alert("Validasi", "Semua field harus diisi!");
      return;
    }

    const kategoriObj = kategoriList.find((k) => k.id === selectedKategori);
    if (!kategoriObj) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "menu"), {
        nama: namaMenu,
        harga: Number(harga),
        kategoriId: selectedKategori,
        kategoriNama: kategoriObj.nama,
        createdAt: new Date(),
      });
      Alert.alert("Sukses", "Menu berhasil ditambahkan!");
      setNamaMenu("");
      setHarga("");
      setSelectedKategori(null);
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Menu",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nama Menu</Text>
        <TextInput style={styles.input} value={namaMenu} onChangeText={setNamaMenu} placeholder="Masukkan nama menu" />

        <Text style={styles.label}>Harga</Text>
        <TextInput style={styles.input} value={harga} onChangeText={setHarga} keyboardType="numeric" placeholder="Contoh: 15000" />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={selectedKategori} onValueChange={(itemValue) => setSelectedKategori(itemValue)}>
            <Picker.Item label="-- Pilih Kategori --" value={null} />
            {kategoriList.map((kategori) => (
              <Picker.Item key={kategori.id} label={kategori.nama} value={kategori.id} />
            ))}
          </Picker>
        </View>

        <View style={{ marginTop: 20 }}>{loading ? <ActivityIndicator /> : <Button title="Simpan Menu" onPress={handleSubmit} />}</View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
  },
});
