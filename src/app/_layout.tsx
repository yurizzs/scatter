import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { BalanceProvider } from '@/context/BalanceContext';
import { CasinoColors } from '@/constants/CasinoTheme';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <BalanceProvider>
      <View style={{ flex: 1, backgroundColor: CasinoColors.bgDarkest }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: CasinoColors.bgDarkest },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </View>
    </BalanceProvider>
  );
}
