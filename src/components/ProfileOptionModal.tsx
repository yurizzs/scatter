import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutConfirmationModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirmLogout,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out" size={32} color={CasinoColors.goldPrimary} />
          </View>

          <Text style={styles.modalTitle}>Logout Session?</Text>
          <Text style={styles.modalSub}>
            Are you sure you want to log out? Logging out will end your current session.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirmLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CasinoColors.borderGold,
    padding: 24,
    alignItems: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CasinoColors.bgDark,
    borderWidth: 1.5,
    borderColor: CasinoColors.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: CasinoColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: CasinoColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: CasinoColors.bgCard,
    borderWidth: 1,
    borderColor: CasinoColors.borderEmerald,
    alignItems: 'center',
  },
  cancelText: {
    color: CasinoColors.textSecondary,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  logoutBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: CasinoColors.goldPrimary,
    alignItems: 'center',
  },
  logoutText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
});
