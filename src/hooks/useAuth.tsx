import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ROLE_KEYS, ROLE_LABELS, RoleKey } from '@/constants/roles';

interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: RoleKey;
  organization?: string;
  location?: string;
  phone?: string;
}

interface AuthUser {
  id: string;
  email: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role: RoleKey;
  organization?: string;
  location?: string;
  phone?: string;
}

type AuthBackend = 'local' | 'supabase';

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  backend: AuthBackend;
  initializeComplete: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  profile: Profile;
}

const LOCAL_USERS_KEY = 'agrichain__users';
const LOCAL_SESSION_KEY = 'agrichain__session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useSupabasePreferred = () => import.meta.env.VITE_USE_SUPABASE === 'true';

const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse stored users', error);
    return [];
  }
};

const persistUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const getStoredSession = (): { userId: string } | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse stored session', error);
    return null;
  }
};

const persistSession = (session: { userId: string } | null) => {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    return;
  }
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
};

const toProfile = (data: any): Profile | null => {
  if (!data) return null;
  if (!ROLE_KEYS.includes(data.role)) return null;
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name ?? data.fullName ?? '',
    role: data.role,
    organization: data.organization ?? '',
    location: data.location ?? '',
    phone: data.phone ?? '',
  };
};

const toAuthUser = (sessionUser: any): AuthUser | null => {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    email: sessionUser.email,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [backend, setBackend] = useState<AuthBackend>('local');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializeComplete, setInitializeComplete] = useState(false);

  const loadLocalSession = useCallback(async () => {
    const session = getStoredSession();
    if (!session) {
      setUser(null);
      setProfile(null);
      return;
    }
    const users = getStoredUsers();
    const storedUser = users.find((item) => item.id === session.userId);
    if (!storedUser) {
      persistSession(null);
      setUser(null);
      setProfile(null);
      return;
    }
    setUser({ id: storedUser.id, email: storedUser.email });
    setProfile(storedUser.profile);
  }, []);

  const loadSupabaseSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const sessionUser = data.session?.user ?? null;
    setUser(toAuthUser(sessionUser));
    if (sessionUser) {
      await refreshProfileFromSupabase(sessionUser.id);
    } else {
      setProfile(null);
    }
  }, []);

  const refreshProfileFromSupabase = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Supabase profile fetch error:', error);
        }
        setProfile(null);
        return;
      }

      const formatted = toProfile(data);
      if (formatted) {
        setProfile(formatted);
      } else {
        console.warn('Profile data missing required fields; skipping');
        setProfile(null);
      }
    } catch (err) {
      console.error('Unexpected profile fetch error:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (useSupabasePreferred()) {
          setBackend('supabase');
          await loadSupabaseSession();
          setLoading(false);
          setInitializeComplete(true);
          supabase.auth.onAuthStateChange(async (_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(toAuthUser(sessionUser));
            if (sessionUser) {
              await refreshProfileFromSupabase(sessionUser.id);
            } else {
              setProfile(null);
            }
          });
          return;
        }
      } catch (error) {
        console.warn('Supabase auth unavailable, falling back to local auth.', error);
      }

      setBackend('local');
      await loadLocalSession();
      setLoading(false);
      setInitializeComplete(true);
    };

    init();
  }, [loadLocalSession, loadSupabaseSession, refreshProfileFromSupabase]);

  const signUpLocal = useCallback(
    async ({ email, password, fullName, role, organization, location, phone }: SignUpPayload) => {
      setLoading(true);
      try {
        const users = getStoredUsers();
        const emailExists = users.some((existing) => existing.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        const passwordHash = await hashPassword(password);
        const id = crypto.randomUUID();
        const newProfile: Profile = {
          id,
          email,
          fullName,
          role,
          organization,
          location,
          phone,
        };

        const updatedUsers: StoredUser[] = [
          ...users,
          {
            id,
            email,
            passwordHash,
            profile: newProfile,
          },
        ];

        persistUsers(updatedUsers);
        persistSession({ userId: id });

        setUser({ id, email });
        setProfile(newProfile);
        toast({ title: 'Account Created', description: `Signed in as ${fullName} (${ROLE_LABELS[role]})` });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signInLocal = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const users = getStoredUsers();
      const storedUser = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (!storedUser) {
        throw new Error('No account found with that email. Please sign up first.');
      }

      const passwordHash = await hashPassword(password);
      if (storedUser.passwordHash !== passwordHash) {
        throw new Error('Invalid credentials. Please try again.');
      }

      persistSession({ userId: storedUser.id });
      setUser({ id: storedUser.id, email: storedUser.email });
      setProfile(storedUser.profile);
      toast({
        title: 'Signed In',
        description: `Welcome back ${storedUser.profile.fullName} (${ROLE_LABELS[storedUser.profile.role]})`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const signOutLocal = useCallback(async () => {
    persistSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const signUpSupabase = useCallback(async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName,
            role: payload.role,
            organization: payload.organization,
            location: payload.location,
            phone: payload.phone,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      const sessionUser = data.session?.user ?? data.user;
      if (!sessionUser) {
        throw new Error('Signup succeeded but no user session was returned.');
      }

      const authUser = toAuthUser(sessionUser);
      setUser(authUser);

      const profilePayload = {
        id: sessionUser.id,
        email: payload.email,
        full_name: payload.fullName,
        role: payload.role,
        organization: payload.organization,
        location: payload.location,
        phone: payload.phone,
      };

      const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, {
        onConflict: 'id',
      });

      if (profileError) {
        throw profileError;
      }

      const formattedProfile = toProfile(profilePayload);
      setProfile(formattedProfile);
      toast({
        title: 'Account Created',
        description: `Signed in as ${payload.fullName} (${ROLE_LABELS[payload.role]})`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const signInSupabase = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      const sessionUser = data.user ?? data.session?.user;
      if (!sessionUser) {
        throw new Error('Authentication succeeded but no user returned.');
      }

      const authUser = toAuthUser(sessionUser);
      setUser(authUser);
      await refreshProfileFromSupabase(sessionUser.id);
      if (authUser) {
        toast({ title: 'Signed In', description: `Signed in as ${authUser.email}` });
      }
    } finally {
      setLoading(false);
    }
  }, [refreshProfileFromSupabase]);

  const signOutSupabase = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (backend === 'supabase') {
        try {
          await signInSupabase(email, password);
        } catch (error: any) {
          toast({
            title: 'Login Error',
            description: error?.message || 'Unable to sign in with Supabase. Falling back to local auth.',
            variant: 'destructive',
          });
          setBackend('local');
          await signInLocal(email, password);
        }
      } else {
        try {
          await signInLocal(email, password);
        } catch (error: any) {
          toast({
            title: 'Login Error',
            description: error?.message || 'Unable to sign in',
            variant: 'destructive',
          });
          throw error;
        }
      }
    },
    [backend, signInLocal, signInSupabase]
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      if (backend === 'supabase') {
        try {
          await signUpSupabase(payload);
        } catch (error: any) {
          toast({
            title: 'Signup Error',
            description: error?.message || 'Unable to sign up with Supabase. Falling back to local auth.',
            variant: 'destructive',
          });
          setBackend('local');
          await signUpLocal(payload);
        }
      } else {
        try {
          await signUpLocal(payload);
        } catch (error: any) {
          toast({
            title: 'Signup Error',
            description: error?.message || 'Unable to create account',
            variant: 'destructive',
          });
          throw error;
        }
      }
    },
    [backend, signUpLocal, signUpSupabase]
  );

  const signOut = useCallback(async () => {
    if (backend === 'supabase') {
      await signOutSupabase();
    } else {
      await signOutLocal();
    }
  }, [backend, signOutLocal, signOutSupabase]);

  const refreshProfile = useCallback(async () => {
    if (backend === 'supabase') {
      if (user?.id) {
        await refreshProfileFromSupabase(user.id);
      }
    } else {
      await loadLocalSession();
    }
  }, [backend, loadLocalSession, refreshProfileFromSupabase, user]);

  const contextValue: AuthContextType = {
    user,
    profile,
    loading,
    backend,
    initializeComplete,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
