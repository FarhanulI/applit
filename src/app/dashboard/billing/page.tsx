"use client";
import { useAuthContext } from "@/contexts/auth";
import PageTitle from "@/ui/text/pageTitle";
import React from "react";

import PaymentMethod from "./_components/paymentMethod";
import CurrentBenefits from "./_components/currentBenefits";
import NextInvoice from "./_components/nextInvoice";
import CurrentPlan from "./_components/currentPlan";
import RecentInvoice from "./_components/recentInvoice";

const Billing = () => {
  return (
    <div>
      <PageTitle title="Billing" />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-8">
        <CurrentPlan />

        <CurrentBenefits />

        <NextInvoice />

        <PaymentMethod />

        <RecentInvoice/>
      </div>
    </div>
  );
};

export default Billing;
