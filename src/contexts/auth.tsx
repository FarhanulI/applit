/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase-config";
import { handleSetUserProfile } from "@/lib/auth/utils";
import { UserProfileType } from "@/lib/auth/type";
import { fetchUserStats } from "@/lib/file/apis";
import { UserStatsType } from "@/lib/file/types";

// ✅ 1. Define the shape of the context
type AuthContextType = {
  user: UserProfileType | undefined;
  setUser: Dispatch<SetStateAction<UserProfileType | undefined>>;
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  userStats: UserStatsType | undefined;
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>;
};

// ✅ 2. Create the context instance
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ 3. Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileType | undefined>();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStatsType | undefined>();

  const handleSetUserStats = async (user: User | null) => {
    // @ts-ignore
    const stats = await fetchUserStats(user);
    setUserStats(stats as UserStatsType);
  };

  useEffect(() => {
    console.log({userStats})
  }, [userStats])
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const userProfile = handleSetUserProfile(firebaseUser);

      setUser(userProfile);
      handleSetUserStats(firebaseUser);
      setIsLoggedIn(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn,
        setIsLoggedIn,
        userStats,
        setUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 4. Hook to use the context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
