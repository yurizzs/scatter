import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SplashScreenComponent } from '@/components/SplashScreen';
import { BottomNavigation, NavTab } from '@/components/BottomNavigation';
import { NotificationToast } from '@/components/NotificationToast';
import { HomeScreen } from '@/screens/HomeScreen';
import { LuckySpinScreen } from '@/screens/LuckySpinScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { DepositScreen } from '@/screens/DepositScreen';
import { WithdrawScreen } from '@/screens/WithdrawScreen';
import { CasinoColors } from '@/constants/CasinoTheme';

type SubScreen = null | 'lucky-spin' | 'deposit' | 'withdraw';

export default function AppMain() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [subScreen, setSubScreen] = useState<SubScreen>(null);

  if (showSplash) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
  }

  const renderCurrentScreen = () => {
    // Dedicated SubScreens (Full screen views)
    if (subScreen === 'lucky-spin') {
      return (
        <LuckySpinScreen
          onBack={() => setSubScreen(null)}
          onOpenDeposit={() => setSubScreen('deposit')}
        />
      );
    }

    if (subScreen === 'deposit') {
      return <DepositScreen onBack={() => setSubScreen(null)} />;
    }

    if (subScreen === 'withdraw') {
      return <WithdrawScreen onBack={() => setSubScreen(null)} />;
    }

    // Main Bottom Tab Screens
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileScreen
            onOpenDeposit={() => setSubScreen('deposit')}
            onOpenWithdraw={() => setSubScreen('withdraw')}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            onOpenLuckySpin={() => setSubScreen('lucky-spin')}
            onOpenDeposit={() => setSubScreen('deposit')}
            onOpenProfile={() => setActiveTab('profile')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Animated Toast Notifications */}
      <NotificationToast />

      {/* Main Content Area */}
      <View style={styles.contentArea}>{renderCurrentScreen()}</View>

      {/* Fixed Bottom Navigation Bar (Hidden when inside full-page subScreens like deposit/withdraw/spin) */}
      {subScreen === null && (
        <BottomNavigation
          currentTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CasinoColors.bgDarkest,
  },
  contentArea: {
    flex: 1,
  },
});
