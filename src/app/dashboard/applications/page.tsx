"use client";
import Table from "@/ui/table/table";
import PageTitle from "@/ui/text/pageTitle";
import React from "react";

const Applications = () => {
  const jobData = [
    {
      jobTitle: "--",
      company: "Siemens AG",
      status: "Submitted",
      date: "28 Aug 2025",
      action: "View",
    },
    {
      jobTitle: "Frontend Developer",
      company: "BMW Group",
      status: "In Review",
      date: "12 Aug 2025",
      action: "View / Edit",
    },
    {
      jobTitle: "Junior Web Designer",
      company: "Lufthansa",
      status: "Draft",
      date: "05 Aug 2025",
      action: "Edit / Delete",
    },
    {
      jobTitle: "Graphic Designer",
      company: "Bosch GmbH",
      status: "Submitted",
      date: "18 Aug 2025",
      action: "View",
    },
    {
      jobTitle: "Product Designer",
      company: "Deutsche Bank",
      status: "Submitted",
      date: "05 Aug 2025",
      action: "View",
    },
  ];

  const columns = [
    {
      key: "jobTitle",
      title: "Job Title",
      className: "",
      minWidth: "150px",
    },
    {
      key: "company",
      title: "Company",
      minWidth: "120px",
    },
    {
      key: "status",
      title: "Status",
      type: "status",
      minWidth: "100px",
    },
    {
      key: "date",
      title: "Date",
      className: "text-gray-600",
      minWidth: "110px",
    },
    {
      key: "action",
      title: "Action",
      className: "text-gray-600",
      minWidth: "120px",
      render: (value, row) => (
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
          {value.split(" / ").map((action, index) => (
            <button
              key={index}
              className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm whitespace-nowrap"
              onClick={() =>
                console.log(`${action} clicked for ${row.jobTitle}`)
              }
            >
              {action}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="Application History / Saved Drafts " />

      <div className="mt-8">
        <Table
          columns={columns}
          data={jobData}
          hover={true}
          bordered={true}
          rounded={true}
          minWidth="700px"
        />
      </div>
    </div>
  );
};

export default Applications;
