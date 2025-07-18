import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please use a different email or try signing in.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled. Please contact support.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found with this email. Please check your email or sign up.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials and try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
