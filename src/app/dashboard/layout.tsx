/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { ReactNode } from "react";
import DashboardSidebar from "./_components/sidebar";
import { useAuthContext } from "@/contexts/auth";
import { Zap } from "lucide-react";
import { UserProfileType } from "@/lib/auth/type";

interface IDashboardLayout {
  children: ReactNode;
}

const DashboardLayout = ({ children }: IDashboardLayout) => {
  // @ts-ignore
  const { user, userStats } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar user={user} />

      <main className="flex-1 p-6 ml-64">
        {/* Header */}

        {/* Main Content */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
