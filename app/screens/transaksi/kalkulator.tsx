import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function KalkulatorPage() {
  const { selected, metode } = useLocalSearchParams();
  const items = JSON.parse(selected as string);

  // Gunakan 'harga' bukan 'price'
  const totalHarga = items.reduce((acc: number, item: any) => {
    const harga = parseInt(item.harga) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + harga * quantity;
  }, 0);

  const [uang, setUang] = useState("");
  const router = useRouter();

  const bayar = parseInt(uang) || 0;
  const kembalian = bayar >= totalHarga ? bayar - totalHarga : 0;

  const handleBayar = () => {
    if (bayar < totalHarga) {
      alert("Uang tidak cukup");
      return;
    }

    router.push({
      pathname: "/screens/transaksi/receipt",
      params: {
        items: JSON.stringify(items),
        metode,
        uangDibayar: bayar,
        totalHarga,
        kembalian,
      },
    });
  };

  const handleShortcut = (amount: number) => {
    setUang((parseInt(uang) || 0) + amount + "");
  };

  const handleClear = () => setUang("");

  const handleUangPas = () => setUang(totalHarga.toString());

  return (
    <>
      <Stack.Screen options={{ title: "Kalkulator" }} />
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Total: Rp{totalHarga.toLocaleString()}</Text>

        <TextInput
          placeholder="Uang dari pelanggan"
          keyboardType="numeric"
          value={uang}
          onChangeText={(text) => {
            const sanitized = text.replace(/[^0-9]/g, "");
            setUang(sanitized);
          }}
          style={{
            borderWidth: 1,
            padding: 10,
            width: "100%",
            marginBottom: 10,
            fontSize: 18,
          }}
        />

        {/* Kembalian jika valid */}
        {bayar >= totalHarga && <Text style={{ fontSize: 18, color: "green", marginBottom: 10 }}>Kembalian: Rp{kembalian.toLocaleString()}</Text>}

        {/* Shortcut Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          {[10000, 20000, 50000].map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => handleShortcut(val)}
              style={{
                backgroundColor: "#e0e0e0",
                padding: 10,
                borderRadius: 8,
                width: "30%",
                alignItems: "center",
              }}
            >
              <Text>+Rp{val / 1000}K</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleUangPas}
            style={{
              backgroundColor: "#4caf50",
              padding: 10,
              borderRadius: 8,
              width: "48%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Uang Pas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClear}
            style={{
              backgroundColor: "#f44336",
              padding: 10,
              borderRadius: 8,
              width: "48%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Clear</Text>
          </TouchableOpacity>
        </View>

        <Button title="Bayar" onPress={handleBayar} />
      </View>
    </>
  );
}
