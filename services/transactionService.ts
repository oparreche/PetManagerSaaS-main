import { PaymentTransaction } from '../types';

const KEY = 'transactions';

export const recordTransaction = (tx: PaymentTransaction) => {
  const list: PaymentTransaction[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  list.push(tx);
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const listTransactions = (): PaymentTransaction[] => {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
};