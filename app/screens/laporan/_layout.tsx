import { Stack } from 'expo-router';

export default function LaporanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // tampilkan header Stack (bukan drawer)
      }}
    />
  );
}
