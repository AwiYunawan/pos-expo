import { Stack } from 'expo-router';

export default function TransaksiLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // tetap tampil header dari Stack
      }}
    />
  );
}
