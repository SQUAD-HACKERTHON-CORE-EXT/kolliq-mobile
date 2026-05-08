import { create } from 'zustand';
import { Wallet, Transaction } from '../types';

interface WalletStore {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  setWallet: (wallet: Wallet) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,

  setWallet: (wallet) => set({ wallet }),

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateBalance: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance: state.wallet.balance + amount }
        : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
