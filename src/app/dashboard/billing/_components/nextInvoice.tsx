import { useAuthContext } from "@/contexts/auth";
import { formatDateToStr } from "@/utils";
import React from "react";

const NextInvoice = () => {
  const { user } = useAuthContext();

  return (
    <div className="col-span-3 lg:col-span-1 px-8 py-5 bg-white rounded-xl shadow-md gap-3">
      <div className="border-b border-[#D9D9D9] ">
        <p className="text-black text-lg font-semibold py-2">Next Invoice</p>
      </div>

      <div className="flex flex-col gap-3 text-black mt-4">
        <p className="text-lg font-bold ">€ {user?.currentPlan?.amount || 0}</p>

        <p>Plan type: {user?.currentPlan?.name || 'No Plan'}</p>
        <p>Next Invoice: {formatDateToStr(user?.currentPlan?.expiredAt)}</p>
      </div>
    </div>
  );
};

export default NextInvoice;
