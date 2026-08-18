import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { useBalance } from '@/context/BalanceContext';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';

export const NotificationToast: React.FC = () => {
  const { toast, hideToast } = useBalance();
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 50,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismissToast();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      dismissToast();
    }
  }, [toast.visible]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideToast();
    });
  };

  if (!toast.visible) return null;

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return CasinoColors.goldPrimary;
      case 'error':
        return CasinoColors.error;
      default:
        return CasinoColors.emeraldAccent;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color={CasinoColors.goldPrimary} />;
      case 'error':
        return <Ionicons name="alert-circle" size={24} color={CasinoColors.error} />;
      default:
        return <Ionicons name="information-circle" size={24} color={CasinoColors.emeraldAccent} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          borderColor: getBorderColor(),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{toast.title}</Text>
          <Text style={styles.messageText}>{toast.message}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={dismissToast}>
          <Ionicons name="close" size={18} color={CasinoColors.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: CasinoColors.bgCardElevated,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: CasinoColors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  messageText: {
    color: CasinoColors.textSecondary,
    fontSize: 12.5,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
