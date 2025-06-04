import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import KelolaKategoriScreen from '../screens/KelolaKategoriScreen';
import KelolaMenuScreen from '../screens/KelolaMenuScreen'; 
import PengeluaranIndex from '../screens/PengeluaranPage';
import PengeluaranPage from '../screens/PengeluaranPage';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  return (
	<Drawer.Navigator>
	  <Drawer.Screen name="Kelola Kategori" component={KelolaKategoriScreen} />
	  <Drawer.Screen name="Kelola Menu" component={KelolaMenuScreen} />
	  <Drawer.Screen name="Pengeluaran" component={PengeluaranPage} />
	  </Drawer.Navigator>
  );
}
