"use client";

import { useAuth } from "@/lib/auth";
import GoogleLoginButton from "@/ui/buttons/googleButton";
import Input from "@/ui/input/input";
import { useRouter } from "next/navigation";
import React from "react";
import { FaFacebookF, FaYahoo } from "react-icons/fa";

const SignIn = () => {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    authError,
    setShowPassword,
    handleSignUp,
    handleInputChange,
    handleGoogleSignIn,
  } = useAuth();
  const router = useRouter();

  return (
    <form className="mt-4 space-y-6" onSubmit={handleSignUp}>
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName as string}
          placeholder="Enter your Full name"
          onChange={handleInputChange}
          required
        />

        {/* Email Field */}

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your password"
          error={errors.email}
          required
        />

        {/* Password Field */}
        <Input
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          placeholder="Enter your password"
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
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
              Registering...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already Have an Account?
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-500"
            onClick={() => router.push("/auth/signIn")}
          >
            Sign in
          </a>
        </p>
      </div>

      <p className="text-sm font-semibold text-black  mb-2 text-center">
        Or join with{" "}
      </p>

      <div className="flex justify-center items-center gap-2">
        <GoogleLoginButton
          icon={<FaFacebookF color="blue" className="w-5 h-5" />}
        />
        <GoogleLoginButton onClick={() => handleGoogleSignIn()} />
        <GoogleLoginButton
          icon={<FaYahoo color="blue" className="w-5 h-5" />}
        />
      </div>
    </form>
  );
};

export default SignIn;
