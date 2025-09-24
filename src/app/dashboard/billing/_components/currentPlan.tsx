import { useAuthContext } from "@/contexts/auth";
import { PaymentMethodEnum } from "@/enums";
import { formatDateToStr } from "@/utils";
import React, { useState } from "react";
import {
  cancelPayPalSubscription,
  cancelStripeSubscription,
} from "../../pricing/apis";
import { updateUserPlan } from "@/lib/file/apis";
import { UserStatsType } from "@/lib/file/types";
import Button from "@/ui/buttons/button";

const CurrentPlan = () => {
  const { user, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleCancelPlan = async () => {
    if (!user?.currentPlan) return;

    setLoading(true);
    const { currentPlan } = user;
    const { paymentMethod, sessionId, subscriptionID } = currentPlan;

    try {
      let isCanceled = false;

      const cancelActions: Record<string, () => Promise<boolean>> = {
        [PaymentMethodEnum.stripe]: async () =>
          sessionId ? await cancelStripeSubscription(sessionId) : false,

        [PaymentMethodEnum.paypal]: async () => {
          if (!subscriptionID) return false;
          const { success } = await cancelPayPalSubscription(subscriptionID);
          return true;
        },
      };

      if (
        currentPlan.type === "unlimited" &&
        paymentMethod &&
        cancelActions[paymentMethod]
      ) {
        isCanceled = await cancelActions[paymentMethod]();
      }

      if (currentPlan.type !== "unlimited") {
        isCanceled = true; // For one-time payments, just update the DB
      }

      if (!isCanceled) return;

      // Build updated stats
      const updatedStats: Partial<UserStatsType> = {
        currentPlan: null,
        stats: user.stats
          ? { ...user.stats, remainingCoverLetter: null }
          : undefined,
      };

      // Update DB & local state
      const response = await updateUserPlan(user.uid as string, updatedStats);
      setUser(response as UserStatsType);
    } catch (error) {
      console.error("❌ Error cancelling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-3 bg-white rounded-xl px-8 py-5 shadow-md">
      <div className="flex justify-between items-center flex-wrap gap-8">
        <div className="text-black flex flex-col gap-3">
          <p>Current Plans</p>
          <p className="text-2xl font-bold">
            {user?.currentPlan?.name ?? "No Plan"}
          </p>
          <p className="text-sm">
            Standard monthly subscription plan active since:{" "}
            {formatDateToStr(user?.currentPlan?.purchasedAt as string)}
          </p>
        </div>

        {user?.currentPlan && (
          <div className="flex items-center gap-3">
            <Button
              label="Cancel Plan"
              isLoading={loading}
              className="border border-black text-black px-5 py-3 rounded-md font-semibold cursor-pointer"
              onClick={handleCancelPlan}
            />

            <button
              className=" bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 px-5 py-3 rounded-md font-semibold cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPlan;
