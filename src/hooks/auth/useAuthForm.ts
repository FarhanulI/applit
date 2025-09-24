import { validateEmail, validatePassword } from "@/lib/auth/utils";
import { useState } from "react";

export interface FormData {
  email: string;
  password: string;
  fullName?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateResetPasswordForm = (): boolean => {
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

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      fullName: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setAuthError("");
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    authError,
    setFormData,
    setErrors,
    setIsLoading,
    setShowPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setAuthError: setAuthErrorMessage,
    validateForm,
    validateResetPasswordForm,
    handleInputChange,
    clearAuthError,
    resetForm,
  };
};