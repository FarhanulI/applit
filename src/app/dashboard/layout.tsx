/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { ReactNode, useMemo } from "react";
import DashboardSidebar from "./_components/sidebar";
import { useAuthContext } from "@/contexts/auth";

interface IDashboardLayout {
  children: ReactNode;
}

const DashboardLayout = ({ children }: IDashboardLayout) => {
  // @ts-ignore
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar user={user} />

      <main className="flex-1 px-8 lg:px-13 lg:ml-64 pt-8 pb-8 bg-[#F5F5F5]">
        {/* Main Content */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
