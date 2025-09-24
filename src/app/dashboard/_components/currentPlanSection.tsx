import { useAuthContext } from "@/contexts/auth";
import { getRemainingDays } from "@/lib/file/utils";
import { AlertTriangle, Zap } from "lucide-react";
import React, { useMemo } from "react";
import RemainingDaysBadge from "./remainingDaysBedge";
import { PlansNameEnum } from "@/enums";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase-config";
import BrandImage from "@/ui/image/brandImage";

const CurrentPlanSection = () => {
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  // const fetchSubscription = async () => {
  //   const response = await fetch("/api/stripe/get-subscription-id", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ sessionId: user?.currentPlan?.sessionId }),
  //   });

  //   console.log({ response });
  // };

  const handleLogout = async () => {
    setUser(undefined);

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex flex-wrap gap-3 justify-between items-center shadow-md bg-[#FFFFFF]  p-4 rounded-xl">
      <div>
        <div className="flex items-center space-x-3 mb-3">
          {/* <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div> */}
          <div className="rounded-full overflow-hidden">
            <BrandImage url={user?.photoURL || ""} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xl">
              {user?.displayName || "John Doe"}
            </p>
            <p className="text-md text-[#6E6E6E]">{user?.email}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="inline-flex items-center space-x-2">
          <button
            className="flex gap-2 px-4 cursor-pointer  py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 shadow-lg hover:shadow-xl"
            onClick={() => handleLogout()}
          >
            Logout
          </button>

          {/* {user?.currentPlan && (
            <RemainingDaysBadge remainingDays={remainingDays} />
          )} */}

          {/* {user?.currentPlan && isExpired && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-sm font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>Expired</span>
            </div>
          )} */}
        </div>

        {/* {user?.currentPlan &&
          user?.currentPlan?.type === PlansNameEnum.standard && (
            <div
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full cursor-pointer
        bg-green-400 text-white border border-green-700 text-sm font-medium hover:bg-green-500"
              onClick={() => router.push("/dashboard/pricing")}
            >
              Upgrade
            </div>
          )}

        {user?.currentPlan &&
          user?.currentPlan?.type === PlansNameEnum.unlimited && (
            <div
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full cursor-pointer
        bg-red-400 text-white border border-red-700 text-sm font-medium hover:bg-red-500"
              onClick={() => router.push("/dashboard/pricing")}
            >
              Cancel
            </div>
          )} */}
      </div>
    </div>
  );
};

export default CurrentPlanSection;
