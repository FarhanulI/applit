"use client";
import Header from "@/ui/headers/headers";
import MainLogo from "@/ui/svgs/mainLogo";
import React, { Suspense } from "react";

import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center justify-center">
            <MainLogo />
          </div>

          {children}
        </div>
      </main>
    </Suspense>
  );
};

export default AuthLayout;
