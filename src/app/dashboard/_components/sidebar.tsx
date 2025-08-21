import { auth } from "@/config/firebase-config";
import { useAuthContext } from "@/contexts/auth";
import { UserProfileType } from "@/lib/auth/type";
import { signOut, User } from "firebase/auth";
import {
  Menu,
  X,
  LogOut,
  Settings,
  CreditCard,
  FileText,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface IDashboardSidebar {
  user: UserProfileType | undefined;
}

const menuItems = [
  {
    href: "/dashboard",
    icon: <FileText className="w-5 h-5" />,
    label: "Dashboard",
    id: "dashboard",
  },
  // {
  //   href: "/cv-builder",
  //   icon: <Upload className="w-5 h-5" />,
  //   label: "Upload CV",
  //   id: "cv-builder",
  // },
  {
    href: "/dashboard/my-documents",
    icon: <FileText className="w-5 h-5" />,
    label: "My Documents",
    id: "documents",
  },
  {
    href: "/dashboard/cover-letter-templates",
    icon: <FileText className="w-5 h-5" />,
    label: "Cover Letters Templates",
    id: "cover-letters-templates",
  },
  {
    href: "/dashboard/pricing",
    icon: <FileText className="w-5 h-5" />,
    label: "Pricings",
    id: "pricings",
  },
  {
    href: "/applications",
    icon: <FileText className="w-5 h-5" />,
    label: "Applications",
    id: "applications",
  },
  {
    href: "/billing",
    icon: <CreditCard className="w-5 h-5" />,
    label: "Billing",
    id: "billing",
  },
  {
    href: "/profile-settings",
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    id: "profile-settings",
  },
];

const DashboardSidebar = ({ user }: IDashboardSidebar) => {
  const pathname = usePathname();
  const { setUser, setUserStats } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    setUserStats(undefined);
    setUser(undefined);

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    await signOut(auth);
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10 pt-16 flex flex-col justify-between">
      <div className="p-6">
        {/* User Profile */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.displayName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.displayName}</p>
              <p className="text-sm text-gray-600">{"Free Plan"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at the Bottom */}
      <div className="p-6">
        <button
          onClick={() => handleLogout()} // Replace with your logout function
          className="w-full cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
