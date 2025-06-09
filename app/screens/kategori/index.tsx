import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../../../FirebaseConfig';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

type Kategori = {
  id: string;
  nama: string;
};

// Komponen KategoriItem (sebelumnya file terpisah)
type ItemProps = {
  nama: string;
  onEdit: () => void;
  onDelete: () => void;
};

function KategoriItem({ nama, onEdit, onDelete }: ItemProps) {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.text}>{nama}</Text>
      <View style={itemStyles.actions}>
        <Pressable onPress={onEdit} style={itemStyles.buttonEdit}>
          <Text style={itemStyles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={itemStyles.buttonDelete}>
          <Text style={itemStyles.buttonText}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
    <>
    <Stack.Screen
        options={{
          title: 'Kategori',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    <View style={screenStyles.container}>
      <Text style={screenStyles.title}>Kelola Kategori Menu</Text>

      <View style={screenStyles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Masukkan nama kategori"
          style={screenStyles.input}
        />
        <Pressable onPress={handleSimpan} style={screenStyles.buttonSimpan}>
          <Text style={screenStyles.buttonText}>{editingId ? 'Update' : 'Tambah'}</Text>
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
    </>
  );
  
}

// Style untuk screen utama
const screenStyles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  inputContainer: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 },
  buttonSimpan: { backgroundColor: 'green', padding: 10, borderRadius: 8, marginLeft: 10 },
  buttonText: { color: 'white' },
});

// Style untuk item kategori
const itemStyles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonEdit: {
    backgroundColor: 'orange',
    padding: 6,
    borderRadius: 5,
  },
  buttonDelete: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
