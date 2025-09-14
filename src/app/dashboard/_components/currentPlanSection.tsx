import { useAuthContext } from "@/contexts/auth";
import { getRemainingDays } from "@/lib/file/utils";
import { AlertTriangle, Zap } from "lucide-react";
import React, { useMemo } from "react";
import RemainingDaysBadge from "./remainingDaysBedge";
import { PlansNameEnum } from "@/enums";
import { useRouter } from "next/navigation";

const CurrentPlanSection = () => {
  const { userStats, user } = useAuthContext();
  const router = useRouter();
  const fetchSubscription = async () => {
    const response = await fetch("/api/stripe/get-subscription-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId: userStats?.currentPlan?.sessionId }),
    });

    console.log({ response });
  };

  const { remainingDays, isExpired } = useMemo(() => {
    const remainingDays = getRemainingDays(
      userStats?.currentPlan?.expiredAt as string
    );

    return { remainingDays, isExpired: remainingDays <= 0 };
  }, [userStats?.currentPlan]);

  return (
    <div className="flex justify-between items-start bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl">
      <div>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
          <div>
            <p className="font-semibold text-gray-900">{user?.displayName}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2">
          <div
            className="flex gap-2 px-4 cursor-pointer w-full py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 shadow-lg hover:shadow-xl"
          >
            <Zap />
            {userStats?.currentPlan?.name || "No Plan Activate"}
          </div>

          {userStats?.currentPlan && (
            <RemainingDaysBadge remainingDays={remainingDays} />
          )}

          {userStats?.currentPlan && isExpired && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-sm font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>Expired</span>
            </div>
          )}
        </div>
      </div>

      {userStats?.currentPlan && userStats?.currentPlan?.type === PlansNameEnum.standard && (
        <div
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full cursor-pointer
        bg-green-400 text-white border border-green-700 text-sm font-medium hover:bg-green-500"
          onClick={() => router.push("/dashboard/pricing")}
        >
          Upgrade
        </div>
      )}

      {userStats?.currentPlan && userStats?.currentPlan?.type === PlansNameEnum.unlimited && (
        <div
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full cursor-pointer
        bg-red-400 text-white border border-red-700 text-sm font-medium hover:bg-red-500"
          onClick={() => router.push("/dashboard/pricing")}
        >
          Cancel
        </div>
      )}
    </div>
  );
};

export default CurrentPlanSection;
