import React, { createContext, useContext, useState } from 'react';

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

interface BalanceContextType {
  balance: number;
  formattedBalance: string;
  transactions: Transaction[];
  toast: ToastConfig;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  deposit: (amount: number, method?: string) => boolean;
  withdraw: (amount: number, method?: string) => { success: boolean; message: string };
  addSpinReward: (amount: number, rewardLabel: string) => void;
  deductBet: (betAmount: number) => boolean;
  addSlotWinnings: (winningsAmount: number, winLabel: string) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const formatCurrency = (val: number): string => {
  return `₱${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-initial',
      type: 'deposit',
      amount: 1250,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Welcome Demo Bonus',
      paymentMethod: 'Scatter Bonus',
    },
  ]);

  const [toast, setToast] = useState<ToastConfig>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, title, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const deposit = (amount: number, method: string = 'Cash G'): boolean => {
    if (amount <= 0) return false;
    const newBal = balance + amount;
    setBalance(newBal);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Demo Deposit',
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      '✓ Deposit Successful',
      `₱${amount.toLocaleString()} has been deposited to your demo account.`,
      'success'
    );
    return true;
  };

  const withdraw = (amount: number, method: string = 'Cash G'): { success: boolean; message: string } => {
    if (amount <= 0) {
      showToast('Error', 'Please select a withdrawal amount.', 'error');
      return { success: false, message: 'Please select a withdrawal amount.' };
    }

    if (amount > balance) {
      showToast(
        'Insufficient Demo Balance',
        'You don\'t have enough demo coins for this withdrawal.',
        'error'
      );
      return { success: false, message: 'Insufficient demo balance.' };
    }

    const newBal = balance - amount;
    setBalance(newBal);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdraw',
      amount,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Demo Withdrawal',
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      '✓ Withdrawal Successful',
      `₱${amount.toLocaleString()} has been withdrawn from your demo account.`,
      'success'
    );
    return { success: true, message: `₱${amount} withdrawn` };
  };

  const addSpinReward = (amount: number, rewardLabel: string) => {
    if (amount > 0) {
      setBalance((prev) => prev + amount);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'spin_win',
        amount,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Lucky Spin: ${rewardLabel}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(
        '🎉 Lucky Spin Win!',
        `Congratulations! You won ${rewardLabel} (₱${amount.toLocaleString()}) added to your demo balance!`,
        'success'
      );
    } else {
      showToast('Lucky Spin Result', `${rewardLabel}! Spin again to win demo rewards!`, 'info');
    }
  };

  const deductBet = (betAmount: number): boolean => {
    if (betAmount <= 0) return false;

    if (betAmount > balance) {
      showToast(
        'Insufficient Demo Balance',
        'You don\'t have enough demo balance for this bet.',
        'error'
      );
      return false;
    }

    setBalance((prev) => prev - betAmount);
    return true;
  };

  const addSlotWinnings = (winningsAmount: number, winLabel: string) => {
    if (winningsAmount > 0) {
      setBalance((prev) => prev + winningsAmount);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'spin_win',
        amount: winningsAmount,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Slot Win: ${winLabel}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(
        '🎉 Slot Machine Win!',
        `YOU WON ₱${winningsAmount.toLocaleString()}! (${winLabel})`,
        'success'
      );
    }
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        formattedBalance: formatCurrency(balance),
        transactions,
        toast,
        showToast,
        hideToast,
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
