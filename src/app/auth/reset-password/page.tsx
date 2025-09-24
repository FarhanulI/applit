/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/reset-password/page.tsx or app/reset-password/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/config/firebase-config";
import { validatePassword } from "@/lib/auth/utils";
import Input from "@/ui/input/input";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");
  const apiKey = searchParams.get("apiKey");
  const continueUrl = searchParams.get("continueUrl");

  // Form state
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Verify the reset code when component mounts
  useEffect(() => {
    const verifyResetCode = async () => {
      if (!oobCode || mode !== "resetPassword") {
        setErrors({
          general: "Invalid reset link. Please request a new password reset.",
        });
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the password reset code and get the email
        const email = await verifyPasswordResetCode(auth, oobCode);
        setUserEmail(email);
        setIsValidCode(true);
      } catch (error: any) {
        console.error("Error verifying reset code:", error);
        let errorMessage = "Invalid or expired reset link.";

        if (error.code === "auth/expired-action-code") {
          errorMessage =
            "This reset link has expired. Please request a new password reset.";
        } else if (error.code === "auth/invalid-action-code") {
          errorMessage =
            "This reset link is invalid. Please request a new password reset.";
        }

        setErrors({ general: errorMessage });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyResetCode();
  }, [oobCode, mode]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear general error
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !oobCode) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Confirm the password reset with Firebase
      await confirmPasswordReset(auth, oobCode, formData.newPassword);

      setResetSuccess(true);

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        router.push("/auth/signin?message=password-reset-success");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to reset password. Please try again.";

      if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/expired-action-code") {
        errorMessage =
          "Reset link has expired. Please request a new password reset.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage =
          "Invalid reset link. Please request a new password reset.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/signin");
  };

  const handleRequestNewReset = () => {
    router.push("/auth/forget-password");
  };

  // Loading state while verifying the code
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center ">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className=" flex items-center justify-center ">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
            <button
              onClick={handleBackToLogin}
              className="mt-4 text-blue-600 hover:text-blue-500"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state - invalid or expired link
  if (!isValidCode) {
    return (
      <div className=" flex items-center justify-center ">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {errors.general ||
                "This password reset link is invalid or has expired."}
            </p>
            <div className="mt-6 space-y-2">
              <button
                onClick={handleRequestNewReset}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Request New Password Reset
              </button>
              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className=" flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 002 2M9 5a2 2 0 012 2v8a2 2 0 01-2 2M9 7a2 2 0 012 2v4a2 2 0 01-2 2m6 0a2 2 0 002-2V9a2 2 0 00-2-2"
              ></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password for:{" "}
            <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            {/* New Password Field */}

            <Input
              label="New Password"
              id="newPassword"
              name="newPassword"
              type={"password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              error={errors.newPassword}
            />

            {/* Confirm Password Field */}
            <Input
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type={"password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              error={errors.confirmPassword}
            />
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
