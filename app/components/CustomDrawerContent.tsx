import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/");
  });
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
      <DrawerItem label="Function" icon={({ color, size }) => <Ionicons name="trending-down" color={color} size={size} />} onPress={() => router.push("/coba2/index")} />

      <DrawerItem
        label="Sign Out"
        icon={({ color, size }) => <Ionicons name="log-out" color={color} size={size} />}
        onPress={async () => {
          try {
            await auth.signOut();
          } catch (error) {
            console.error("Error signing out: ", error);
          }
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
