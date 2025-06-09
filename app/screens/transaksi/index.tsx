import { Stack, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { db } from "../../../FirebaseConfig";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function TransaksiPage() {
  const router = useRouter();
  const [menuList, setMenuList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const menuData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        quantity: 0,
      }));
      setMenuList(menuData);
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
        <FlatList
          data={menuList.filter(
            (item) =>
              typeof item.nama === "string" &&
              item.nama.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>
                {item.nama} - Rp{item.harga}
              </Text>
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
