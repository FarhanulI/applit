import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { UserStatsType } from "../file/types";

export const getAuthErrorMessage = (error: unknown): string => {
  let errorMessage = "An error occurred during sign in";

  if (error && typeof error === "object" && "code" in error) {
    const firebaseError = error as { code: string; message?: string };

    switch (firebaseError.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email address";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later";
        break;
      default:
        errorMessage = firebaseError.message || "Sign in failed";
    }
  }

  return errorMessage;
};

export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSetUserProfile = async (
  user: UserStatsType | undefined
): Promise<UserStatsType | undefined> => {
  if (!user) return;

  const userRef = doc(db, "users", user?.uid);
  const userDoc = await getDoc(userRef);

  const userProfile = {
    uid: user.uid,
    email: user?.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: new Date().toISOString(),
    currentPlan: null,
    purchasePlans: [],
    stats: null,
  } as UserStatsType;

  return userDoc.exists() ? (userDoc.data() as UserStatsType) : userProfile;
};
