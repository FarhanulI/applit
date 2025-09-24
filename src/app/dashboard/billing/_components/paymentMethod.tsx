import { getPaymentDetails, getPaypalInvoice } from "@/app/payment/success/utils";
import { useAuthContext } from "@/contexts/auth";
import { CardDescriptionType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

const PaymentMethod = () => {
  const { user } = useAuthContext();
  const [paymentInfo, setPaymentInfo] = useState<CardDescriptionType>();

  const handlePaymentInformation = async () => {
    const res = await getPaymentDetails(user?.currentPlan?.sessionId);
    console.log({res});
    
    if (res?.cardDescription) {
      setPaymentInfo(res.cardDescription);
    }
  };
  useEffect(() => {
    handlePaymentInformation();
  }, [user?.currentPlan]);

  return (
    <div className="lg:col-span-1 col-span-3 px-8 py-5 bg-white rounded-xl shadow-md gap-3">
      <div className="border-b border-[#D9D9D9] ">
        <p className="text-black text-lg font-semibold py-2">Payment Method</p>
      </div>

      <div className="flex flex-col gap-3 text-black mt-4">
        <p className="text-lg font-bold ">{paymentInfo?.description}</p>

        <p>Name of Card: {paymentInfo?.cardholderName}</p>
        <p>Expiration date: {paymentInfo?.exp_year}</p>

        <div className="flex items-center gap-3">
          <button className="border border-[#888888] text-[#525454] px-4 py-2 rounded-md font-semibold cursor-pointer">
            Change Card
          </button>

          <button className="border border-[#888888] text-[#525454] p-3 rounded-md font-semibold cursor-pointer">
            <BiTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
