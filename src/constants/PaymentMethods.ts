export interface PaymentMethod {
  id: string;
  name: string;
  iconName: string;
  color: string;
  badgeText: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cash-g',
    name: 'Cash G',
    iconName: 'wallet',
    color: '#007DFE',
    badgeText: 'Instant Demo',
  },
  {
    id: 'ayam',
    name: 'Ayam',
    iconName: 'credit-card',
    color: '#FF4500',
    badgeText: 'Fast Direct',
  },
  {
    id: 'payme',
    name: 'PayMe',
    iconName: 'dollar-sign',
    color: '#10B981',
    badgeText: 'Zero Fee',
  },
];

export const PRESET_AMOUNTS = [200, 500, 1000, 2000, 3000, 5000, 10000];
