import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SplashScreenComponent } from '@/components/SplashScreen';
import { BottomNavigation, NavTab } from '@/components/BottomNavigation';
import { NotificationToast } from '@/components/NotificationToast';
import { WinModal } from '@/components/WinModal';
import { LoseModal } from '@/components/LoseModal';
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
  const { width } = useWindowDimensions();

  const isWide = width >= 640;

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
    <View style={styles.outerContainer}>
      <View style={[styles.appShell, isWide && styles.appShellWide]}>
        {/* Floating Animated Toast Notifications */}
        <NotificationToast />

        {/* Casino Win Celebration Modal with Spinning Lights */}
        <WinModal />

        {/* Casino Loss Modal with Spinning Red Lights */}
        <LoseModal />

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
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#030C09', // Dark ambient surrounding background for web/tablet
    alignItems: 'center',
    justifyContent: 'center',
  },
  appShell: {
    flex: 1,
    width: '100%',
    backgroundColor: CasinoColors.bgDarkest,
    position: 'relative',
    overflow: 'hidden',
  },
  appShellWide: {
    maxWidth: 600,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: CasinoColors.borderGold,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  contentArea: {
    flex: 1,
  },
});
