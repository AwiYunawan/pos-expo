import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import KelolaKategoriScreen from '../screens/KelolaKategoriScreen';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  return (
	<Drawer.Navigator>
	  <Drawer.Screen name="Kelola Kategori" component={KelolaKategoriScreen} />
	</Drawer.Navigator>
  );
}
