import { signIn as amplifySignIn, fetchAuthSession } from 'aws-amplify/auth';
import { useAuthStore } from './AuthStore';

type SignInParameters = {
  username: string;
  password: string;
};

export async function signIn({ username, password }: SignInParameters) {
  const { setUser, setToken, setEmail, setGroups, setLoading } = useAuthStore.getState();

  try {
    setLoading(true);

    const user = await amplifySignIn({ username, password });

    const session = await fetchAuthSession();

    const accessToken = session.tokens?.accessToken?.toString() || null;
    const idToken = session.tokens?.idToken?.payload;

    // Safely extract email
    const rawEmail = idToken?.email;
    const email = typeof rawEmail === 'string' ? rawEmail : null;

    // Safely extract groups
    const rawGroups = idToken?.['cognito:groups'];
    const groups = Array.isArray(rawGroups) && rawGroups.every(g => typeof g === 'string')
      ? rawGroups as string[]
      : [];

    setUser(user);
    setToken(accessToken);
    setEmail(email);
    setGroups(groups);

    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}
