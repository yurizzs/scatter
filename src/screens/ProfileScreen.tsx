import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalance } from '@/context/BalanceContext';
import { LogoutConfirmationModal } from '@/components/ProfileOptionModal';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const { formattedBalance, transactions, showToast } = useBalance();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNonFunctionalOption = (title: string) => {
    showToast('Demo Settings', `${title} settings are disabled in Demo Mode.`, 'info');
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    showToast('Demo Logout', 'You have exited the demo session.', 'info');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <Text style={styles.screenTitle}>MY PROFILE</Text>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO MODE</Text>
          </View>
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={42} color={CasinoColors.goldPrimary} />
            </View>
            <View style={styles.crownBadge}>
              <Ionicons name="trophy-sharp" size={12} color={CasinoColors.bgDarkest} />
            </View>
          </View>

          <Text style={styles.usernameText}>LuckyPlayer</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Demo Account</Text>
          </View>
        </View>

        {/* Prominent Demo Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceHeaderLabel}>DEMO BALANCE</Text>
          <Text style={styles.balanceValueText}>{formattedBalance}</Text>
          <Text style={styles.balanceNotice}>Fictional demo coins for testing & entertainment</Text>

          {/* Action Buttons: Deposit & Withdraw */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.depositButton}
              onPress={onOpenDeposit}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-down-circle-sharp" size={20} color={CasinoColors.bgDarkest} />
              <Text style={styles.depositButtonText}>DEPOSIT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={onOpenWithdraw}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-up-circle-sharp" size={20} color={CasinoColors.goldPrimary} />
              <Text style={styles.withdrawButtonText}>WITHDRAW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Demo Activity Log */}
        <View style={styles.activityCard}>
          <Text style={styles.sectionHeaderTitle}>RECENT DEMO ACTIVITY</Text>

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No activity recorded yet.</Text>
          ) : (
            transactions.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIconWrap,
                      item.type === 'deposit'
                        ? styles.iconDeposit
                        : item.type === 'withdraw'
                        ? styles.iconWithdraw
                        : styles.iconWin,
                    ]}
                  >
                    <Ionicons
                      name={
                        item.type === 'deposit'
                          ? 'arrow-down-sharp'
                          : item.type === 'withdraw'
                          ? 'arrow-up-sharp'
                          : 'sparkles-sharp'
                      }
                      size={16}
                      color={
                        item.type === 'deposit'
                          ? CasinoColors.emeraldAccent
                          : item.type === 'withdraw'
                          ? CasinoColors.error
                          : CasinoColors.goldPrimary
                      }
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.txDate}>
                      {item.date} {item.paymentMethod ? `via ${item.paymentMethod}` : ''}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    item.type === 'withdraw' ? styles.txAmountMinus : styles.txAmountPlus,
                  ]}
                >
                  {item.type === 'withdraw' ? '-' : '+'}₱{item.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Profile Settings Options */}
        <View style={styles.optionsCard}>
          <Text style={styles.sectionHeaderTitle}>ACCOUNT SETTINGS</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleNonFunctionalOption('Accounts')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="key-sharp" size={20} color={CasinoColors.goldSecondary} />
              <Text style={styles.optionText}>Accounts</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={18} color={CasinoColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleNonFunctionalOption('Security')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="shield-checkmark-sharp" size={20} color={CasinoColors.goldSecondary} />
              <Text style={styles.optionText}>Security</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={18} color={CasinoColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, styles.optionRowLast]}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="log-out-sharp" size={20} color={CasinoColors.error} />
              <Text style={[styles.optionText, { color: CasinoColors.error }]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward-sharp" size={18} color={CasinoColors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CasinoColors.bgDarkest,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CasinoColors.borderEmerald,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 2,
  },
  demoBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: CasinoColors.borderGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  demoBadgeText: {
    color: CasinoColors.goldLight,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  profileHeaderCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderGold,
    padding: 20,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 2.5,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CasinoColors.bgCardElevated,
  },
  usernameText: {
    fontSize: 22,
    fontWeight: '900',
    color: CasinoColors.textPrimary,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CasinoColors.bgDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: CasinoColors.emeraldAccent,
    marginRight: 6,
  },
  statusText: {
    color: CasinoColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  balanceCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: CasinoColors.bgCard,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    padding: 20,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  balanceHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  balanceValueText: {
    fontSize: 34,
    fontWeight: '900',
    color: CasinoColors.goldPrimary,
    letterSpacing: 1,
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  balanceNotice: {
    fontSize: 11,
    color: CasinoColors.textMuted,
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  depositButton: {
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.goldPrimary,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  depositButtonText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    marginLeft: 6,
  },
  withdrawButton: {
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldPrimary,
    paddingVertical: 13,
    borderRadius: 14,
  },
  withdrawButtonText: {
    color: CasinoColors.goldPrimary,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    marginLeft: 6,
  },
  activityCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 16,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: CasinoColors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyText: {
    color: CasinoColors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDeposit: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  iconWithdraw: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  iconWin: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: CasinoColors.textPrimary,
  },
  txDate: {
    fontSize: 10.5,
    color: CasinoColors.textMuted,
    marginTop: 1,
  },
  txAmount: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  txAmountPlus: {
    color: CasinoColors.emeraldAccent,
  },
  txAmountMinus: {
    color: CasinoColors.error,
  },
  optionsCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    marginBottom: 30,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: CasinoColors.textPrimary,
    marginLeft: 12,
  },
});
