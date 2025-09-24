"use client";
import Tabs from "@/ui/tab/tab";
import React from "react";
import CV from "./_components/myDocument";
import MyDocument from "./_components/myDocument";
import PageTitle from "@/ui/text/pageTitle";

const MyDocumentPage = () => {
  return (
    <div>
      <PageTitle title="My Documents" />
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
    </div>
  );
};

export default MyDocumentPage;
