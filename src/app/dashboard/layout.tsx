/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { ReactNode, Suspense } from "react";
import DashboardSidebar from "./_components/sidebar";
import { useAuthContext } from "@/contexts/auth";

interface IDashboardLayout {
  children: ReactNode;
}

const DashboardLayout = ({ children }: IDashboardLayout) => {
  // @ts-ignore
  const { user } = useAuthContext();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50 flex ">
        <DashboardSidebar user={user} />

        <main className="flex-1 px-5 lg:px-13 lg:ml-64 pt-8 pb-8 bg-[#F5F5F5]  w-screen">
          {/* Main Content */}
          {children}
        </main>
      </div>
    </Suspense>
  );
};

export default DashboardLayout;
