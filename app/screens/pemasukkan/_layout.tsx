import { Stack } from 'expo-router';

export default function PemasukkanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // tampilkan header Stack (bukan drawer)
      }}
    />
  );
}
