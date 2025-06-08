import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '../app/components/CustomDrawer';

export default function RootLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
