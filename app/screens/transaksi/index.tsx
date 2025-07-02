import { Picker } from "@react-native-picker/picker"; // Install: expo install @react-native-picker/picker
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { db } from "../../../FirebaseConfig";

export default function TransaksiPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [kategoriList, setKategoriList] = useState<string[]>([]);

  type MenuItem = {
  id: string;
  nama: string;
  harga: number;
  kategoriNama: string;
  quantity: number;
};

const [menuList, setMenuList] = useState<MenuItem[]>([]);


  useEffect(() => {
  const fetchMenu = async () => {
    const querySnapshot = await getDocs(collection(db, "menu"));
    const menuData: MenuItem[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nama: data.nama,
        harga: parseInt(data.harga),
        kategoriNama: data.kategoriNama,
        quantity: 0,
      };
    });
    setMenuList(menuData);
    const kategoriUnik = [
      "Semua",
      ...Array.from(new Set(menuData.map((item) => item.kategoriNama))),
    ];
    setKategoriList(kategoriUnik);
  };
  fetchMenu();
}, []);


  const handleQuantityChange = (itemId: string, change: number) => {
    setMenuList((prevList) =>
      prevList.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const handleNext = () => {
    const selected = menuList.filter((item) => item.quantity > 0);
    if (selected.length === 0) {
      alert("Pilih minimal satu item");
      return;
    }
    router.push({
      pathname: "/screens/transaksi/metode",
      params: { selected: JSON.stringify(selected) },
    });
  };

  // Filter berdasarkan pencarian dan kategori
  const filteredMenu = menuList.filter(
    (item) =>
      item.nama?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "Semua" || item.kategoriNama === selectedCategory)
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transaksi",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <TextInput
          placeholder="Cari menu..."
          value={search}
          onChangeText={setSearch}
          style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        />

        <View style={{ borderWidth: 1, borderRadius: 5, marginBottom: 10 }}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          >
            {kategoriList.map((kategori) => (
              <Picker.Item key={kategori} label={kategori} value={kategori} />
            ))}
          </Picker>
        </View>

        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text>{item.nama} - Rp{item.harga}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Kategori: {item.kategoriNama}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button title="-" onPress={() => handleQuantityChange(item.id, -1)} />
                <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                <Button title="+" onPress={() => handleQuantityChange(item.id, 1)} />
              </View>
            </View>
          )}
        />

        <Button title="Pilih Metode" onPress={handleNext} />
      </View>
    </>
  );
}
