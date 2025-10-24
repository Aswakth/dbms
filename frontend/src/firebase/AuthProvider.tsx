import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import firebaseConfig, { isFirebaseConfigured } from "./firebaseConfig";

// Initialize Firebase only if config looks valid. This prevents runtime errors when
// placeholder or missing API keys are present during development.
let auth: ReturnType<typeof getAuth> | undefined;
let app: ReturnType<typeof initializeApp> | undefined;
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig as any);
    auth = getAuth(app);
    console.info("Firebase client initialized.");
  } catch (e) {
    console.warn("Failed to initialize Firebase client. Auth will be disabled.", e);
    auth = undefined;
  }
} else {
  console.warn("Firebase client config appears missing or incomplete. Auth features are disabled.");
}

const AuthContext = createContext<
  { user: User | null; logout: () => Promise<void> } | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      // no-op when auth is not available
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u: User | null) => setUser(u));
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
