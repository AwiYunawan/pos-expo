import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomDrawer(props: any) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat datang, Budi (admin)</Text>
      </View>

      <View style={{ flex: 1 }}>
        <DrawerItem label="Transaksi" onPress={() => navigation.navigate("screens/transaksi")} />
        <DrawerItem label="Pemasukkan" onPress={() => navigation.navigate("screens/pemasukkan")} />
        <DrawerItem label="Pengeluaran" onPress={() => navigation.navigate("screens/pengeluaran")} />
        <DrawerItem label="Laporan" onPress={() => navigation.navigate("screens/laporan")} />
        <DrawerItem label="Kategori" onPress={() => navigation.navigate("screens/kategori")} />
        <DrawerItem label="Menu" onPress={() => navigation.navigate("screens/menu")} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#4CAF50",
  },
  welcomeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
