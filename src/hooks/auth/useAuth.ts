"use client";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail } from "../../lib/auth/authMethods";
import { useAuthForm } from "./useAuthForm";
import { getAuthErrorMessage, handleSetUserProfile } from "@/lib/auth/utils";
import { useAuthContext } from "@/contexts/auth";
import { handleCheckSessionFile } from "./utils";
import {
  GoogleAuthProvider,
  signInWithPopup,
  confirmPasswordReset,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/config/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserStatsType, UserStatsTypes } from "@/lib/file/types";

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { setUser } = useAuthContext();
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    authError,
    setIsLoading,
    setShowPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setAuthError,
    validateForm,
    validateResetPasswordForm,
    handleInputChange,
    clearAuthError,
    resetForm,
  } = useAuthForm();

  const handleStoreUserProfile = async (user: UserStatsType | undefined) => {
    if (!user) return;
    const userRef = doc(db, "users", user?.uid);

    const existingDoc = await getDoc(userRef);

    if (existingDoc.exists()) return;

    const updatedUserData: UserStatsType = {
      currentPlan: null,
      purchasePlans: [],
      stats: null,
      ...user,
      displayName: formData?.fullName,
    };

    try {
      await setDoc(userRef, updatedUserData, { merge: true });
      setUser(updatedUserData);

      return true;
    } catch (error) {
      console.error("❌ Error updating user with plan:", error);
      return false;
    }
  };

  // Send password reset email
  const handleSendPasswordResetEmail = async (email: string) => {
    setIsLoading(true);
    clearAuthError();

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `https://applit.vercel.app//reset-password`,
        handleCodeInApp: true,
      });
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error: unknown) {
      console.error("Password reset email error:", error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password with new password
  const handleResetPassword = async (e: React.FormEvent, oobCode: string) => {
    e.preventDefault();

    if (!validateResetPasswordForm()) {
      return;
    }

    setIsLoading(true);
    clearAuthError();

    try {
      // Confirm the password reset with Firebase
      await confirmPasswordReset(auth, oobCode, formData.newPassword!);

      // Clear form after successful reset
      resetForm();

      // Redirect to sign in page or show success message
      router.push("/auth/signin?message=password-reset-success");

      return { success: true, message: "Password reset successfully" };
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
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

    const userProfile = await handleSetUserProfile({
      ...user,
      displayName: formData.fullName as string,
    });

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
      const userProfile = await handleSetUserProfile(
        userCredential.user as UserStatsType
      );

      setUser(userProfile);

      const file = handleCheckSessionFile();

      if (file) {
        console.log({ file });
        router.push("/dashboard/pricing");
        return;
      }

      router.push("/dashboard");
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

      const userProfile = await handleSetUserProfile({
        ...userCredential.user,
        displayName: formData.fullName as string,
      });

      console.log({ userProfile });
      debugger;

      const isStoreData = await handleStoreUserProfile(userProfile);

      console.log({ isStoreData });
      debugger;

      if (!isStoreData) return;

      const file = handleCheckSessionFile();
      console.log({ file });

      if (file) {
        router.push("/dashboard/pricing");
        return;
      }

      router.push("/dashboard");
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
    showNewPassword,
    showConfirmPassword,
    authError,
    setShowPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleSignIn,
    handleInputChange,
    handleSignUp,
    handleGoogleSignIn,
    handleSendPasswordResetEmail,
    handleResetPassword,
    resetForm,
  };
};
