import { Stack } from 'expo-router';

export default function PengeluaranLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // tampilkan header Stack (bukan drawer)
      }}
    />
  );
}
