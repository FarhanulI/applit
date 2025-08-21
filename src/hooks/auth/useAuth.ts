import { useRouter } from "next/navigation"; // ✅

import { signInWithEmail, signUpWithEmail } from "../../lib/auth/authMethods";
import { useAuthForm } from "./useAuthForm";
import { getAuthErrorMessage, handleSetUserProfile } from "@/lib/auth/utils";
import { useAuthContext } from "@/contexts/auth";
import { handleCheckSessionFile } from "./utils";

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
    authError,
    setIsLoading,
    setShowPassword,
    setAuthError,
    validateForm,
    handleInputChange,
    clearAuthError,
  } = useAuthForm();

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
      console.log("Sign in successful:", userCredential.user);
      setUser(handleSetUserProfile(userCredential.user));

      const file = handleCheckSessionFile();

      if (file) {
        console.log({ file });

        router.push("/pricing");

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

      const file = handleCheckSessionFile();
      console.log({ file });

      if (file) {
        router.push("/pricing");

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
  };
};
