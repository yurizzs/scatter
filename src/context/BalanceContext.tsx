import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import {
  DemoAccount,
  getDemoAccount,
  recordScatterGameChange,
  scatterDeposit,
  scatterWithdraw,
} from '@/services/api';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'spin_win' | 'bet_deduct';
  amount: number;
  date: string;
  title: string;
  paymentMethod?: string;
}

export interface ToastConfig {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface WinModalConfig {
  visible: boolean;
  amount: number;
  title: string;
  subtitle?: string;
}

export interface LoseModalConfig {
  visible: boolean;
  amount: number;
  title: string;
  subtitle?: string;
}

interface BalanceContextType {
  balance: number;
  formattedBalance: string;
  transactions: Transaction[];
  toast: ToastConfig;
  winModal: WinModalConfig;
  loseModal: LoseModalConfig;
  spinNumber: number;
  incrementSpinNumber: () => number;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  showWinModal: (amount: number, title?: string, subtitle?: string) => void;
  hideWinModal: () => void;
  showLoseModal: (amount: number, title?: string, subtitle?: string) => void;
  hideLoseModal: () => void;
  notifyLoss: (betAmount: number, label?: string) => void;
  refreshBalance: () => Promise<void>;
  deposit: (amount: number, method?: string) => Promise<boolean>;
  withdraw: (amount: number, method?: string) => Promise<{ success: boolean; message: string }>;
  addSpinReward: (amount: number, rewardLabel: string) => void;
  deductBet: (betAmount: number) => boolean;
  addSlotWinnings: (winningsAmount: number, winLabel: string) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const formatCurrency = (val: number): string => {
  return `₱${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spinNumber, setSpinNumber] = useState<number>(1);

  const applySharedAccount = useCallback((account: DemoAccount) => {
    setBalance(account.scatter_balance);
  }, []);

  const [toast, setToast] = useState<ToastConfig>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [winModal, setWinModal] = useState<WinModalConfig>({
    visible: false,
    amount: 0,
    title: 'WIN',
    subtitle: '',
  });

  const [loseModal, setLoseModal] = useState<LoseModalConfig>({
    visible: false,
    amount: 0,
    title: 'LOSE',
    subtitle: '',
  });

  // Listen for deep link return callbacks from Cash G e-wallet app
  useEffect(() => {
    refreshBalance();

    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) parseDeepLinkCallback(initialUrl);
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', (event) => {
      parseDeepLinkCallback(event.url);
    });

    return () => subscription.remove();
  }, []);

  const refreshBalance = useCallback(async () => {
    const account = await getDemoAccount();
    applySharedAccount(account);
  }, [applySharedAccount]);

  const parseDeepLinkCallback = (url: string) => {
    try {
      const parsed = Linking.parse(url);
      const query = parsed.queryParams;

      if (query) {
        const rawAmount = query.amount || query.amt;
        if (rawAmount) {
          const amt = parseFloat(rawAmount as string);
          if (!isNaN(amt) && amt > 0) {
            deposit(amt, 'Cash G E-Wallet');
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing return deep link:', e);
    }
  };

  const incrementSpinNumber = (): number => {
    const current = spinNumber;
    setSpinNumber((prev) => prev + 1);
    return current;
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, title, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const showWinModal = (amount: number, title: string = 'WIN', subtitle: string = '') => {
    setWinModal({
      visible: true,
      amount,
      title,
      subtitle,
    });
  };

  const hideWinModal = () => {
    setWinModal((prev) => ({ ...prev, visible: false }));
  };

  const showLoseModal = (amount: number, title: string = 'LOSE', subtitle: string = '') => {
    setLoseModal({
      visible: true,
      amount,
      title,
      subtitle,
    });
  };

  const hideLoseModal = () => {
    setLoseModal((prev) => ({ ...prev, visible: false }));
  };

  const notifyLoss = (betAmount: number, label: string = 'NO MATCH') => {
    showLoseModal(betAmount, 'LOSE', label);
  };

  const deposit = async (amount: number, method: string = 'Cash G'): Promise<boolean> => {
    if (amount <= 0) return false;

    const res = method === 'Cash G' || method === 'Cash G E-Wallet'
      ? await scatterDeposit(amount)
      : { success: true };

    if (!res.success) {
      showToast('Deposit Failed', res.error || 'Could not deposit from Cash G.', 'error');
      return false;
    }

    if (res.account) {
      applySharedAccount(res.account);
    } else {
      setBalance((prev) => prev + amount);
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Deposit',
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      '✓ Deposit Successful',
      `₱${amount.toLocaleString()} has been deposited to your account.`,
      'success'
    );
    return true;
  };

  const withdraw = async (amount: number, method: string = 'Cash G'): Promise<{ success: boolean; message: string }> => {
    if (amount <= 0) {
      showToast('Error', 'Please select a withdrawal amount.', 'error');
      return { success: false, message: 'Please select a withdrawal amount.' };
    }

    if (amount > balance) {
      showToast(
        'Insufficient Balance',
        'You don\'t have enough coins for this withdrawal.',
        'error'
      );
      return { success: false, message: 'Insufficient balance.' };
    }

    const res = method === 'Cash G' || method === 'Cash G E-Wallet'
      ? await scatterWithdraw(amount)
      : { success: true };

    if (!res.success) {
      showToast('Withdrawal Failed', res.error || 'Could not transfer money to Cash G.', 'error');
      return { success: false, message: res.error || 'Withdrawal failed.' };
    }

    if (res.account) {
      applySharedAccount(res.account);
    } else {
      setBalance((prev) => prev - amount);
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdraw',
      amount,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Withdrawal',
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      '✓ Withdrawal Successful',
      `₱${amount.toLocaleString()} has been withdrawn from your account.`,
      'success'
    );
    return { success: true, message: `₱${amount} withdrawn` };
  };

  const addSpinReward = (amount: number, rewardLabel: string) => {
    if (amount > 0) {
      setBalance((prev) => prev + amount);
      recordScatterGameChange(amount, 'credit', `Lucky Spin: ${rewardLabel}`, 'spin_win');
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'spin_win',
        amount,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Lucky Spin: ${rewardLabel}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showWinModal(amount, 'WIN', `LUCKY SPIN: ${rewardLabel}`);
    } else {
      showToast('Lucky Spin Result', `${rewardLabel}! Spin again to win rewards!`, 'info');
    }
  };

  const deductBet = (betAmount: number): boolean => {
    if (betAmount <= 0) return false;

    if (betAmount > balance) {
      showToast(
        'Insufficient Balance',
        'You don\'t have enough balance for this bet.',
        'error'
      );
      return false;
    }

    setBalance((prev) => prev - betAmount);
    recordScatterGameChange(betAmount, 'debit', 'Bet Placed', 'bet_deduct');
    return true;
  };

  const addSlotWinnings = (winningsAmount: number, winLabel: string) => {
    if (winningsAmount > 0) {
      setBalance((prev) => prev + winningsAmount);
      recordScatterGameChange(winningsAmount, 'credit', `Slot Win: ${winLabel}`, 'spin_win');
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'spin_win',
        amount: winningsAmount,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Slot Win: ${winLabel}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      const isJackpot = winLabel.toUpperCase().includes('JACKPOT');
      showWinModal(winningsAmount, isJackpot ? 'JACKPOT' : 'WIN', winLabel);
    }
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        formattedBalance: formatCurrency(balance),
        transactions,
        toast,
        winModal,
        loseModal,
        spinNumber,
        incrementSpinNumber,
        showToast,
        hideToast,
        showWinModal,
        hideWinModal,
        showLoseModal,
        hideLoseModal,
        notifyLoss,
        refreshBalance,
        deposit,
        withdraw,
        addSpinReward,
        deductBet,
        addSlotWinnings,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
