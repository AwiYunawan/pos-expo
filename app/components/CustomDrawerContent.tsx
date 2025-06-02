import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  
  return (
    <DrawerContentScrollView {...props}>
      {/* Header Drawer */}
      <View style={{ padding: 20, backgroundColor: "#4CAF50" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Selamat Datang!</Text>
      </View>

      {/* Menu Drawer */}
      <DrawerItem label="Transaksi" icon={({ color, size }) => <Ionicons name="cash" color={color} size={size} />} onPress={() => router.push("/transaksi")} />
      <DrawerItem label="Pemasukan" icon={({ color, size }) => <Ionicons name="trending-up" color={color} size={size} />} onPress={() => router.push("/pemasukan")} />
      <DrawerItem label="Pengeluaran" icon={({ color, size }) => <Ionicons name="trending-down" color={color} size={size} />} onPress={() => router.push("/pengeluaran")} />
      <DrawerItem label="Firestore" icon={({ color, size }) => <Ionicons name="trending-down" color={color} size={size} />} onPress={() => router.push("/coba")} />

     
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
