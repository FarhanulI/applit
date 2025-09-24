/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from "react";

import DashboardLayout from "./layout";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  Package,
  Settings,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth";
import { fetchDocuments } from "@/lib/file/apis";
import { UserCvDocument, UserPurchaseListType } from "@/lib/file/types";
import CurrentPlanSection from "./_components/currentPlanSection";
import { CoverLetterPlansIdEnum } from "@/enums";
import PageTitle from "@/ui/text/pageTitle";

const activities = [
  {
    id: 1,
    action: "Downloaded CV",
    document: "Software Engineer CV",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Generated Cover Letter",
    document: "Marketing Manager Position",
    time: "1 day ago",
  },
  {
    id: 3,
    action: "Updated CV",
    document: "Data Analyst CV",
    time: "3 days ago",
  },
  { id: 4, action: "Purchased", document: "Standard Pack", time: "1 week ago" },
];

// @ts-ignore
const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
  };

  return (
    // @ts-ignore
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// @ts-ignore
const RecentDocuemnts = ({ user, documents, loading }) => {
  if (loading) {
    return (
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
    );
  }

  return (
    <div className="rounded-lg shadow-sm bg-white p-4">
      <div className="bg-[#F5F5F5] h-full">
        <div className="p-6 ">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Requested CV
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.slice(0, 3).map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.fileName}</p>
                    <p className="text-sm text-gray-600">{doc.type}</p>
                  </div>
                </div>
                <StatusBadge status={doc.correction_status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthContext();

  const [documentsCV, setDocumentsCV] = useState<UserCvDocument[]>([]);
  const [coverLetters, setCoverLetters] = useState<UserCvDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      if (user) {
        const docs = await fetchDocuments(user.uid);
        const coverLetter = await fetchDocuments(user.uid, "cover-letter");
        setDocumentsCV(docs);
        setCoverLetters(coverLetter);
      }
      setLoading(false);
    };

    loadDocs();
  }, [user]);

  const calculateTotalSpent = (plans: UserPurchaseListType[]) => {
    if (!plans || plans.length === 0) return 0;

    return plans.reduce((total, plan) => total + plan.amount, 0).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <CurrentPlanSection />

      <PageTitle title="Overview" showLogoutButton={false} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white rounded-md shadow-md">
        <div className="bg-[#FAF8F4] p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total CV</p>
              <p className="text-2xl font-bold text-blue-active">
                {documentsCV?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#EFFCEF] p-6 rounded-lg shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Letters</p>
              <p className="text-2xl font-bold text-blue-active">
                {coverLetters.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F4F6FA] p-6 rounded-lg shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Remaining Letters
              </p>
              <p className="text-2xl font-bold text-blue-active">
                {user?.currentPlan?.type === CoverLetterPlansIdEnum.unlimited
                  ? "Unlimited"
                  : user?.stats?.remainingCoverLetter || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#E6F5F9] p-6 rounded-lg shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-blue-active">
                €
                {calculateTotalSpent(
                  user?.purchasePlans as UserPurchaseListType[]
                )}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* @ts-ignore */}
        <RecentDocuemnts user={user} documents={documentsCV} />
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="bg-[#F5F5F5] h-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> -{" "}
                        {activity.document}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
