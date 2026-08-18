import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';
import { useBalance } from '@/context/BalanceContext';

export type NavTab = 'home' | 'games' | 'rewards' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { showToast } = useBalance();

  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'Home',
      iconName: 'home-sharp',
      isFunctional: true,
    },
    {
      id: 'games' as NavTab,
      label: 'Games',
      iconName: 'game-controller-sharp',
      isFunctional: false,
    },
    {
      id: 'rewards' as NavTab,
      label: 'Rewards',
      iconName: 'gift-sharp',
      isFunctional: false,
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile',
      iconName: 'person-sharp',
      isFunctional: true,
    },
  ];

  const handleTabPress = (tabId: NavTab, isFunctional: boolean) => {
    if (isFunctional) {
      onSelectTab(tabId);
    } else {
      showToast(
        'Coming Soon',
        `The ${tabId.toUpperCase()} section is coming soon in the next Scatter update!`,
        'info'
      );
    }
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.navContent}>
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.id, tab.isFunctional)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
                <Ionicons
                  name={tab.iconName as any}
                  size={22}
                  color={isSelected ? CasinoColors.goldPrimary : CasinoColors.textMuted}
                />
              </View>

              <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>
                {tab.label}
              </Text>

              {!tab.isFunctional && (
                <View style={styles.lockDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: CasinoColors.bgDarkest,
    borderTopWidth: 1.5,
    borderTopColor: CasinoColors.borderGold,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapperSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderWidth: 1,
    borderColor: CasinoColors.goldDark,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: CasinoColors.textMuted,
  },
  tabLabelSelected: {
    color: CasinoColors.goldPrimary,
    fontWeight: '800',
  },
  lockDot: {
    position: 'absolute',
    top: 4,
    right: '25%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: CasinoColors.goldDark,
  },
});
