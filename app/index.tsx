import { Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter, useRootNavigationState } from 'expo-router'

export default function Index() {
  const router = useRouter()
  const rootNavigation = useRootNavigationState()

  useEffect(() => {
    if (!rootNavigation?.key) return;
    router.replace('/transaksi');
  }, [rootNavigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
