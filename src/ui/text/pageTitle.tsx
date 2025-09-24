import { auth } from "@/config/firebase-config";
import { useAuthContext } from "@/contexts/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import Button from "../buttons/button";

interface IPageTitle {
  title?: string;
  subtitle?: string;

  showLogoutButton?: boolean;
}

const PageTitle: FC<IPageTitle> = ({
  title,
  subtitle,
  showLogoutButton = true,
}) => {
  const { setUser } = useAuthContext();
  const [logoutLoader, setLogoutLoader] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutLoader(false);
    setUser(undefined);

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    await signOut(auth);
    setLogoutLoader(true);
    router.push("/");
  };
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-[#5D5D5D] mb-2">{title}</h1>

        <p className="mt-3 text-[#525454]">{subtitle}</p>
      </div>

      {showLogoutButton && (
        <Button
          className="flex gap-2 px-4 cursor-pointer  py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600  hover:to-purple-700
               shadow-lg hover:shadow-xl"
          onClick={() => handleLogout()}
          isLoading={logoutLoader}
          label="Logout"
        />
      )}
    </div>
  );
};

export default PageTitle;
