import { Stack } from 'expo-router';

export default function KategoriLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // tampilkan header Stack (bukan drawer)
      }}
    />
  );
}
