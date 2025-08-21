import { validateEmail, validatePassword } from "@/lib/auth/utils";
import { useState } from "react";

export interface FormData {
  email: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
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

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear auth error when user starts typing
    if (authError) {
      setAuthError("");
    }
  };

  const clearAuthError = () => {
    setAuthError("");
  };

  const setAuthErrorMessage = (message: string) => {
    setAuthError(message);
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    authError,
    setFormData,
    setErrors,
    setIsLoading,
    setShowPassword,
    setAuthError: setAuthErrorMessage,
    validateForm,
    handleInputChange,
    clearAuthError,
  };
};
