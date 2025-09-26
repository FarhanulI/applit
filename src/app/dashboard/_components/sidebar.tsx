"use client";

import { auth } from "@/config/firebase-config";
import { useAuthContext } from "@/contexts/auth";
import { UserStatsType } from "@/lib/file/types";
import { signOut, User } from "firebase/auth";
import { Settings, CreditCard, FileText, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface IDashboardSidebar {
  user: UserStatsType | undefined;
}

const menuItems = [
  {
    href: "/dashboard",
    icon: <FileText className="w-5 h-5" />,
    label: "Dashboard",
    id: "dashboard",
  },
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
    href: "/dashboard/applications",
    icon: <FileText className="w-5 h-5" />,
    label: "Applications",
    id: "applications",
  },
  {
    href: "/dashboard/billing",
    icon: <CreditCard className="w-5 h-5" />,
    label: "Billing",
    id: "billing",
  },
  {
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    id: "profile-settings",
  },
];

const DashboardSidebar = ({ user }: IDashboardSidebar) => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  // useEffect(() => {
  //   // if (isDrawerOpen) {
  //   //   document.body.style.overflow = "hidden";
  //   // } else {
  //   //   document.body.style.overflow = "unset";
  //   // }

  //   // Cleanup on unmount
  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, [isDrawerOpen]);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="">
        {/* User Profile */}
        <div className="mb-6 ml-10">
          <Image src="/img/logo.svg" alt="App logo" width={150} height={60} />
        </div>

        {/* Navigation Menu */}
        <nav className="">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.id} className="relative border-t">
                {isActive && (
                  <div className="absolute rounded-r-2xl left-0 top-0 h-full w-[6px] bg-gradient-to-b from-blue-500 to-purple-600" />
                )}
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-4 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#F5F5F5] text-blue-600 border-l"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Logout Button at the Bottom */}
      {/* <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div> */}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Only visible on md and below */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-8 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border-[#5D5D5D] hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Desktop Sidebar - Hidden on md and below */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10 pt-16">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer - Only visible on md and below */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur  z-40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden transform transition-transform duration-300 ease-in-out pt-4">
            {/* Close Button */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="mt-8">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;
