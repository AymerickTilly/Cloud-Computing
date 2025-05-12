import { create } from 'zustand';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';



type AuthStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
  email: string | null;
  groups: string[];
  pendingUsername: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  setEmail: (email: string | null) => void;
  setGroups: (groups: string[]) => void;
  setPendingUsername: (username: string | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  email: null,
  groups: [],
  pendingUsername: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setEmail: (email) => set({ email }),
  setGroups: (groups) => set({ groups }),
  setPendingUsername: (username) => set({ pendingUsername: username }),
  resetAuth: () =>
    set({
      user: null,
      email: null,
      groups: [],
      pendingUsername: null,
      loading: false,
    }),
}));

// Initialize auth state on app startup
export const initAuth = async () => {
  const { setLoading, setUser, setEmail, setGroups, resetAuth } = useAuthStore.getState();
  setLoading(true);
  try {
    // Fetch session first to verify tokens
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.payload;

    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Extract email and groups from ID token
    const rawEmail = idToken.email;
    const email = typeof rawEmail === 'string' ? rawEmail : null;
    const rawGroups = idToken['cognito:groups'];
    const groups = Array.isArray(rawGroups) && rawGroups.every((g) => typeof g === 'string')
      ? rawGroups
      : [];

    // Get user data
    const user = await getCurrentUser();

    // Update store
    setUser(user);
    setEmail(email);
    setGroups(groups);
  } catch (error) {
    console.error('Error initializing auth:', error);
    resetAuth(); // Clear state if no valid session/user
  } finally {
    setLoading(false);
  }
};

export const getAccessToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() || null;
};

