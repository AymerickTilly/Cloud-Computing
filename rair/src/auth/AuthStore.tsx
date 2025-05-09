// In AuthStore.ts
import { create } from 'zustand';

type AuthStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  loading: boolean;
  token: string | null;
  email: string | null;
  groups: string[];
  pendingUsername: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setGroups: (groups: string[]) => void;
  setPendingUsername: (username: string | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  token: null,
  email: null,
  groups: [],
  pendingUsername: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setToken: (token) => set({ token }),
  setEmail: (email) => set({ email }),
  setGroups: (groups) => set({ groups }),
  setPendingUsername: (username) => set({ pendingUsername: username }),
  resetAuth: () =>
    set({
      user: null,
      token: null,
      email: null,
      groups: [],
      loading: false,
    }),
}));
