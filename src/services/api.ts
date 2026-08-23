import { Platform } from 'react-native';

const LAN_BACKEND_URL = 'http://192.168.254.108:3001';

const getBackendUrl = () => {
  if (Platform.OS === 'android') {
    return LAN_BACKEND_URL;
  }

  return 'http://localhost:3001';
};

export const API_BASE_URL = getBackendUrl();
export const DEMO_USER_ID = 'DEMO-001';

export interface DemoTransaction {
  id: string;
  type: string;
  title: string;
  description: string;
  amount: number;
  isCredit: boolean;
  status: string;
  timestamp: string;
}

export interface DemoAccount {
  user_id: string;
  name: string;
  mobile: string;
  cashg_balance: number;
  scatter_balance: number;
  transactions: DemoTransaction[];
}

type TransferResponse = {
  success: boolean;
  message?: string;
  account?: DemoAccount;
  error?: string;
};

let fallbackAccount: DemoAccount = {
  user_id: DEMO_USER_ID,
  name: 'Demo User',
  mobile: '09171234567',
  cashg_balance: 100,
  scatter_balance: 0,
  transactions: [],
};

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function postDemo(path: string, body: Record<string, unknown>) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: DEMO_USER_ID, ...body }),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function getDemoAccount(): Promise<DemoAccount> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/demo/account/${DEMO_USER_ID}`);
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    const data = await response.json();
    if (data.success && data.account) {
      fallbackAccount = data.account;
      return data.account;
    }
  } catch (err) {
    console.warn('Could not sync Scatter with shared backend:', err);
  }

  return fallbackAccount;
}

export async function scatterDeposit(amount: number): Promise<TransferResponse> {
  try {
    const data = await postDemo('/api/demo/scatter/deposit', { amount, source: 'cash_g' });
    const account = await getDemoAccount();
    return { success: true, message: data.message, account };
  } catch (err: any) {
    console.warn('Backend deposit network request failed, falling back to local demo state:', err?.message || err);
    fallbackAccount = {
      ...fallbackAccount,
      scatter_balance: fallbackAccount.scatter_balance + amount,
      cashg_balance: Math.max(0, fallbackAccount.cashg_balance - amount),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'deposit',
          title: 'Deposit from Cash G',
          description: 'Scatter Deposit (Demo)',
          amount,
          isCredit: true,
          status: 'completed',
          timestamp: new Date().toISOString(),
        },
        ...fallbackAccount.transactions,
      ],
    };
    return { success: true, message: 'Deposit successful (Demo Mode)', account: fallbackAccount };
  }
}

export async function scatterWithdraw(amount: number): Promise<TransferResponse> {
  try {
    const data = await postDemo('/api/demo/scatter/withdraw', { amount, destination: 'cash_g' });
    const account = await getDemoAccount();
    return { success: true, message: data.message, account };
  } catch (err: any) {
    console.warn('Backend withdrawal network request failed, falling back to local demo state:', err?.message || err);
    if (fallbackAccount.scatter_balance < amount) {
      return { success: false, error: 'Insufficient balance.' };
    }
    fallbackAccount = {
      ...fallbackAccount,
      scatter_balance: fallbackAccount.scatter_balance - amount,
      cashg_balance: fallbackAccount.cashg_balance + amount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'withdraw',
          title: 'Withdrawal to Cash G',
          description: 'Scatter Withdrawal (Demo)',
          amount,
          isCredit: false,
          status: 'completed',
          timestamp: new Date().toISOString(),
        },
        ...fallbackAccount.transactions,
      ],
    };
    return { success: true, message: 'Withdrawal successful (Demo Mode)', account: fallbackAccount };
  }
}

export async function recordScatterGameChange(
  amount: number,
  direction: 'credit' | 'debit',
  title: string,
  type: 'spin_win' | 'bet_deduct'
): Promise<void> {
  try {
    const data = await postDemo('/api/demo/scatter/adjust', {
      amount,
      direction,
      title,
      description: title,
      type,
    });

    if (data.account) {
      fallbackAccount = data.account;
    }
  } catch (err) {
    console.warn('Could not record Scatter game balance change:', err);
  }
}
