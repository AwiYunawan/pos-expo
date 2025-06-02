import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  nama: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function KategoriItem({ nama, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{nama}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.buttonEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.buttonDelete}>
          <Text style={styles.buttonText}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10, marginBottom: 8, backgroundColor: '#eee', borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  text: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonEdit: {
    backgroundColor: 'orange', padding: 6, borderRadius: 5
  },
  buttonDelete: {
    backgroundColor: 'red', padding: 6, borderRadius: 5
  },
  buttonText: {
    color: 'white'
  }
});
