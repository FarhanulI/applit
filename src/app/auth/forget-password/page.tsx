"use client";
import { auth } from "@/config/firebase-config";
import Input from "@/ui/input/input";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsError(false);
    // setIsSent(false); // removed unused state
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setIsError(false);
    // setIsSent(false); // removed unused state
    setMessage("");
    try {
      const result = await (async () => {
        try {
          await sendPasswordResetEmail(auth, email, {
            url: `https://applit.vercel.app/reset-password`,
            handleCodeInApp: true,
          });

          setMessage("Password reset email sent! Check your inbox.");
          return { success: true, message: "Password reset email sent!" };
        } catch (error: unknown) {
          let errorMsg = "Failed to send reset email.";
          if (typeof error === "object" && error !== null && "code" in error) {
            const code = (error as { code: string }).code;
            if (code === "auth/user-not-found") {
              errorMsg = "No user found with this email.";
            } else if (code === "auth/invalid-email") {
              errorMsg = "Invalid email address.";
            }
          }
          return { success: false, message: errorMsg };
        }
      })();
      if (result.success) {
        setIsError(false);
      } else {
        setIsError(true);
      }
      setMessage(result.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-6">
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={handleInputChange}
        // error={errors.email}
        placeholder="Enter your password"
        required
      />

      {message && (
        <div className="ml-3 text-center">
          <p className="text-sm text-green-500 font-semibold">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        onClick={() => handleForgotPassword()}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          "Sent Reset Link"
        )}
      </button>
    </div>
  );
};

export default ForgetPassword;
