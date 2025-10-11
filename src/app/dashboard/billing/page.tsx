"use client";
import { useAuthContext } from "@/contexts/auth";
import PageTitle from "@/ui/text/pageTitle";
import React, { useEffect, useState } from "react";

import PaymentMethod from "./_components/paymentMethod";
import CurrentBenefits from "./_components/currentBenefits";
import NextInvoice from "./_components/nextInvoice";
import CurrentPlan from "./_components/currentPlan";
import RecentInvoice from "./_components/recentInvoice";
import { fetchUserStats } from "@/lib/file/apis";
import SubscriptionSkeleton from "./_components/loader";
import { UserStatsType } from "@/lib/file/types";

const Billing = () => {
  const { user: currentUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserStatsType>()

  useEffect(() => {
    if (currentUser) {
      fetchUserStats(currentUser).then((res) => {
        console.log({ res });
        setUser(res as UserStatsType)
        setLoading(false);
      });
    }
  }, [currentUser]);

  if (!loading) {
    return (
      <div>
        <PageTitle title="Billing" />

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-8">
          <CurrentPlan />

          <CurrentBenefits />

          <NextInvoice />

          <PaymentMethod />

          <RecentInvoice />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Billing" />

      <div className="mt-8">
        <SubscriptionSkeleton />
      </div>
    </div>
  );
};

export default Billing;
