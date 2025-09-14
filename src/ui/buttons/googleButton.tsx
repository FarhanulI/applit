// src/components/GoogleLoginButton.jsx

import React from "react";
import googleLogo from "../assets/google-logo.png"; // Ensure you have a logo

const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 533.5 544.3"
  >
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-18.3-1.6-36.1-4.6-53.2H272.1v100.8h147.3c-6.4 34.5-25.4 63.7-54.2 83.1v68h87.7c51.2-47.2 80.6-116.7 80.6-198.7z"
    />
    <path
      fill="#34A853"
      d="M272.1 544.3c73.7 0 135.6-24.4 180.8-66.1l-87.7-68c-24.4 16.4-55.7 26-93.1 26-71.5 0-132-48.1-153.7-112.6H27.1v70.7C72.5 487.9 165.5 544.3 272.1 544.3z"
    />
    <path
      fill="#FBBC05"
      d="M118.4 323.6c-10.1-30-10.1-62.5 0-92.5V160.4H27.1c-40.6 81.1-40.6 176.7 0 257.8l91.3-70.7z"
    />
    <path
      fill="#EA4335"
      d="M272.1 107.7c39.9 0 75.8 13.7 104.1 40.7l78.1-78.1C407.7 24.1 345.8 0 272.1 0 165.5 0 72.5 56.5 27.1 160.4l91.3 70.7c21.7-64.5 82.2-112.6 153.7-112.6z"
    />
  </svg>
);

const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
    >
      <GoogleIcon />
      <span className="text-sm font-medium text-gray-700">
        Sign in with Google
      </span>
    </button>
  );
};

export default GoogleLoginButton;
