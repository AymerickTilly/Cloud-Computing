import { create } from 'zustand';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';



type AuthStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
  email: string | null;
  groups: string[];
  pendingUsername: string | null;
  passwordReset: boolean | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  setEmail: (email: string | null) => void;
  setGroups: (groups: string[]) => void;
  setPendingUsername: (username: string | null) => void;
  setPasswordReset: (passwordReset: boolean | null) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  email: null,
  groups: [],
  pendingUsername: null,
  passwordReset: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setEmail: (email) => set({ email }),
  setGroups: (groups) => set({ groups }),
  setPendingUsername: (username) => set({ pendingUsername: username }),
  setPasswordReset: (passwordReset) => set({ passwordReset }),
  resetAuth: () =>
    set({
      user: null,
      email: null,
      groups: [],
      pendingUsername: null,
      loading: false,
      passwordReset: null
    }),
}));

// Initialize auth state on app startup
export const initAuth = async () => {
  const { setLoading, setUser, setEmail, setGroups, resetAuth } = useAuthStore.getState();
  setLoading(true);

  try {
    const user = await getCurrentUser();

    // Only fetch session if user is authenticated
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.payload;

    if (!idToken) {
      throw new Error('No ID token found');
    }

    const rawEmail = idToken.email;
    const email = typeof rawEmail === 'string' ? rawEmail : null;
    const rawGroups = idToken['cognito:groups'];
    const groups = Array.isArray(rawGroups) && rawGroups.every((g) => typeof g === 'string')
      ? rawGroups
      : [];

    setUser(user);
    setEmail(email);
    setGroups(groups);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'UserUnAuthenticatedException') {
      // No user is signed in — this is not an error
      console.log('User not signed in yet');
    } else {
      console.error('Error initializing auth:', error);
    }
    resetAuth();
  } finally {
    setLoading(false);
  }
};


export const getIdToken = async () => {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() || null;
};

