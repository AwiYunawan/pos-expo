import { Stack } from "expo-router";

export default function TransactionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="calculator" />
      <Stack.Screen name="receipt" />
    </Stack>
  );
}
