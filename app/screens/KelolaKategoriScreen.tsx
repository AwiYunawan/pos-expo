import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../../FirebaseConfig';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import KategoriItem from '../components/KategoriItem';

type Kategori = {
  id: string;
  nama: string;
};

export default function KelolaKategoriScreen() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const kategoriRef = collection(db, 'kategori');

  useEffect(() => {
    const unsubscribe = onSnapshot(kategoriRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        nama: doc.data().nama,
      })) as Kategori[];
      setKategori(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSimpan = async () => {
    if (!input.trim()) return;

    if (editingId) {
      const ref = doc(db, 'kategori', editingId);
      await updateDoc(ref, { nama: input });
      setEditingId(null);
    } else {
      await addDoc(kategoriRef, { nama: input });
    }

    setInput('');
  };

  const handleEdit = (item: Kategori) => {
    setInput(item.nama);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Hapus Kategori', 'Yakin ingin menghapus?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'kategori', id));
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kelola Kategori Menu</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Masukkan nama kategori"
          style={styles.input}
        />
        <Pressable onPress={handleSimpan} style={styles.buttonSimpan}>
          <Text style={styles.buttonText}>{editingId ? 'Update' : 'Tambah'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={kategori}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <KategoriItem
            nama={item.nama}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  inputContainer: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 },
  buttonSimpan: { backgroundColor: 'green', padding: 10, borderRadius: 8, marginLeft: 10 },
  buttonText: { color: 'white' },
});
