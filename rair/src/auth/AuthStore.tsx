import { create } from 'zustand';

interface IAuth {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  token: string | null;
  email: string | null;
  groups: string[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any | null) => void;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setGroups: (groups: string[]) => void;
  setLoading: (loading: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<IAuth>((set) => ({
  user: null,
  token: null,
  email: null,
  groups: [],
  loading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setEmail: (email) => set({ email }),
  setGroups: (groups) => set({ groups }),
  setLoading: (loading) => set({ loading }),
  resetAuth: () =>
    set({
      user: null,
      token: null,
      email: null,
      groups: [],
      loading: false,
    }),
}));
