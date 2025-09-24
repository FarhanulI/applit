import React from "react";
import Input from "@/ui/input/input";
import BrandButton from "@/ui/buttons/brandButton";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

const SecuritySection = () => {
  const {
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    error,
    loading,
    success,
    handleSubmit,
  } = useResetPassword();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-black">Change Password</h2>

      <div className="mt-8 flex flex-col gap-6 md:max-w-md">
        <Input
          label="Old Password"
          value={oldPassword}
          name="old_password"
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old password"
          type="password"
          required
          error={error && !oldPassword ? error : undefined}
        />

        <Input
          label="New Password"
          value={newPassword}
          name="new_password"
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          type="password"
          required
          error={error && !newPassword ? error : undefined}
        />

        <Input
          label="Confirm New Password"
          value={confirmPassword}
          name="confirm_new_password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          type="password"
          required
          error={error && newPassword !== confirmPassword ? error : undefined}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">
            Password changed successfully ✅
          </p>
        )}
      </div>

      <button
        className={` mt-8 px-4 cursor-pointer w-52 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 shadow-lg hover:shadow-xl text-center`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </div>
  );
};

export default SecuritySection;
