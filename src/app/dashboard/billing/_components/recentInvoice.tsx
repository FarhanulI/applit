/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/contexts/auth";
import { UserPurchaseListType } from "@/lib/file/types";
import Table from "@/ui/table/table";
import { formatDateToStr } from "@/utils";
import React, { useMemo } from "react";

const jobData = (plans: UserPurchaseListType[]) =>
  plans.map((item) => ({
    date: formatDateToStr(item?.purchasedAt) || "N/A",
    paymentType: item?.name || "N/A",
    price: `$${item?.amount.toFixed(2)}` || "N/A",
    action: "Download",
  }));

const columns = [
  {
    key: "date",
    title: "Date",
    className: "",
    //   minWidth: "150px",
  },
  {
    key: "paymentType",
    title: "Payment Type",
    //   minWidth: "120px",
  },
  {
    key: "price",
    title: "Price",
    //   minWidth: "100px",
  },
  {
    key: "action",
    title: "Action",
    // className: "text-gray-600",
    // minWidth: "120px",
    render: (value: string, row: any) => (
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
        {value.split(" / ").map((action, index) => (
          <button
            key={index}
            className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm whitespace-nowrap"
            onClick={() => console.log(`${action} clicked for ${row.jobTitle}`)}
          >
            {action}
          </button>
        ))}
      </div>
    ),
  },
];

const RecentInvoice = () => {
  const { user } = useAuthContext();

  const columnData = useMemo(() => {
    if (user) {
      return jobData(
        user?.purchasePlans?.slice(0, 3) as UserPurchaseListType[]
      );
    }
    return [];
  }, [user]);
  return (
    <div className="col-span-2 bg-white rounded-xl px-8 py-5 shadow-md">
      <div className="border-b border-[#D9D9D9] ">
        <p className="text-black text-lg font-semibold py-2">Recent Invoice</p>
      </div>

      <Table columns={columns} data={columnData} bordered={true} />
    </div>
  );
};

export default RecentInvoice;
