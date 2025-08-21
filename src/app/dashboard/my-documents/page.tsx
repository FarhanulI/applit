"use client";
import Tabs from "@/ui/tab/tab";
import React from "react";
import CV from "./_components/myDocument";
import MyDocument from "./_components/myDocument";

const MyDocumentPage = () => {
  return (
    <Tabs
      tabs={[
        {
          id: "cv",
          title: "CV",
          content: <MyDocument type={"cv"} />,
        },

        {
          id: "cover-letter",
          title: "Cover Letters",
          content: <MyDocument type={"cover-letter"} />,
        },
      ]}
    />
  );
};

export default MyDocumentPage;
