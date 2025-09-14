import { useRouter } from "next/navigation"; // ✅

import { signInWithEmail, signUpWithEmail } from "../../lib/auth/authMethods";
import { useAuthForm } from "./useAuthForm";
import { getAuthErrorMessage, handleSetUserProfile } from "@/lib/auth/utils";
import { useAuthContext } from "@/contexts/auth";
import { handleCheckSessionFile } from "./utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/config/firebase-config";
import { updateUserWithPlan } from "@/lib/file/utils";
import { UserProfileType } from "@/lib/auth/type";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserStatsType } from "@/lib/file/types";

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { setUser, setUserStats } = useAuthContext();
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    authError,
    setIsLoading,
    setShowPassword,
    setAuthError,
    validateForm,
    handleInputChange,
    clearAuthError,
  } = useAuthForm();

  const handleStoreUserProfile = async (user: UserProfileType | undefined) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const existingDoc = await getDoc(userRef);

    if (existingDoc.exists()) return;

    const updatedUserData: UserStatsType = {
      currentPlan: null,
      purchasePlans: [],
      stats: null,
    };

    try {
      await setDoc(userRef, { ...user, ...updatedUserData }, { merge: true });
      setUserStats(updatedUserData);

      return true;
    } catch (error) {
      console.error("❌ Error updating user with plan:", error);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    });

    if (!response.ok) {
      throw new Error("Session creation failed.");
    }

    const userProfile = handleSetUserProfile(user);

    setUser(userProfile);

    const isStoreData = handleStoreUserProfile(userProfile);

    if (!isStoreData) return;

    const file = handleCheckSessionFile();

    if (file) {
      router.push("/dashboard/pricing");

      return;
    }
    router.push("/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearAuthError();

    try {
      const userCredential = await signInWithEmail(
        formData.email,
        formData.password
      );

      // 🔐 Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // 🍪 Send token to your API route to set the session cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        throw new Error("Session creation failed.");
      }

      // Handle successful sign in
      const userProfile = handleSetUserProfile(userCredential.user);

      setUser(userProfile);

      const file = handleCheckSessionFile();

      if (file) {
        console.log({ file });

        router.push("/dashboard/pricing");

        return;
      }

      router.push("/dashboard");

      // TODO: Redirect to dashboard or home page after successful sign in
      // You can use Next.js router here: router.push('/dashboard')
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearAuthError();

    try {
      const userCredential = await signUpWithEmail(
        formData.email,
        formData.password
      );

      // Handle successful sign in
      console.log("Register successful:", userCredential.user);

      // 🔐 Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // 🍪 Send token to your API route to set the session cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        throw new Error("Session creation failed.");
      }

      const userProfile = handleSetUserProfile(userCredential.user);

      setUser(userProfile);

      const isStoreData = handleStoreUserProfile(userProfile);

      if (!isStoreData) return;

      const file = handleCheckSessionFile();
      console.log({ file });

      if (file) {
        router.push("/dashboard/pricing");

        return;
      }

      router.push("/dashboard");

      // TODO: Redirect to dashboard or home page after successful sign in
      // You can use Next.js router here: router.push('/dashboard')
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    authError,
    setShowPassword,
    handleSignIn,
    handleInputChange,
    handleSignUp,
    handleGoogleSignIn,
  };
};
