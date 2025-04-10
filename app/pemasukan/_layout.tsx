import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "../components/CustomDrawerContent";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="transaksi"
          options={{
            drawerLabel: "Transaksi",
            headerTitle: "Halaman Transaksi",
            drawerIcon: ({ color, size }) => <Ionicons name="cash" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="pemasukan"
          options={{
            drawerLabel: "Pemasukan",
            headerTitle: "Halaman Pemasukan",
            drawerIcon: ({ color, size }) => <Ionicons name="trending-up" color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="pengeluaran"
          options={{
            drawerLabel: "Pengeluaran",
            headerTitle: "Halaman Pengeluaran",
            drawerIcon: ({ color, size }) => <Ionicons name="trending-down" color={color} size={size} />,
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}
