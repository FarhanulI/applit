"use client";
import React, { useState } from "react";
import CardWrapper from "./_components/cardWrapper";
import BrandImage from "@/ui/image/brandImage";
import { useAuthContext } from "@/contexts/auth";
import { Trash } from "lucide-react";
import { BiEdit, BiTrash, BiUpload } from "react-icons/bi";
import SecuritySection from "./_components/securitySection";
import PageTitle from "@/ui/text/pageTitle";
import { updateUserPlan, uploadFileToFirebase } from "@/lib/file/apis";
import SpinLoader from "@/ui/loaders/spinLoader";
import EditableField from "./_components/editableField";

const tabs = [
  { key: "general", label: "General" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Login security" },
];

const Settings = () => {
  const { user, setUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("general");
  const [photoLoader, setPhotoLoader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setPhotoLoader(true);
    const res = await uploadFileToFirebase(file, `${user?.uid}/profile`, user!);
    if (res) {
      setUser((prev) => (prev ? { ...prev, photoURL: res } : prev));
      setPhotoLoader(false);
      return true;
    }
  };

  const handleOnSave = async (value: string, field: string) => {
    console.log({ value, field });

    setEditLoader(true);
    const res = await updateUserPlan(user?.uid as string, { [field]: value });
    if (res) {
      setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
      setEditLoader(false);
      return true;
    }
    setEditLoader(false);

    return false;
  };

  return (
    <>
      <PageTitle title="Settings" />

      <div className="mt-4 w-full  mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar / Top navigation */}
          <div className="flex gap-2 lg:flex-col lg:w-64 md:px-8 px-3 md:mt-12 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`md:px-4 md:py-4  px-1 py-2 md:text-lg text-sm font-medium lg:text-left text-center 
                  transition-colors w-full md:rounded-lg rounded-md border-b border-[#f5f5f5]
                ${
                  activeTab === tab.key
                    ? "bg-[#E4EAF5] text-blue-active"
                    : "text-[#5D5D5D] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 p-6 mt-6 mb-6">
            {activeTab === "general" && (
              <div className="space-y-4">
                <CardWrapper>
                  <div className="flex justify-between items-center">
                    <BrandImage url={user?.photoURL as string} />

                    <div className="flex items-center gap-3">
                      {/* <button className="border border-red-500 text-red-500 rounded-lg p-2 cursor-pointer">
                        <BiTrash size="25px" />
                      </button> */}

                      <div className="relative">
                        <input
                          type="file"
                          id="profile-pi-upload"
                          accept=".pdf,.doc,.docx"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            console.log({ files: e.target.files });
                            const file = e.target.files?.[0];
                            handleUploadFile(file!);
                          }}
                        />
                        <label
                          htmlFor="profile-pi-upload"
                          className="border border-[#888888] text-black 
                        rounded-lg py-2 px-3 cursor-pointer flex items-center gap-2"
                        >
                          {photoLoader ? (
                            <SpinLoader />
                          ) : (
                            <>
                              <span className="bg-blue-active text-white p-1 rounded-full">
                                <BiUpload />
                              </span>{" "}
                              Upload
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </CardWrapper>
                <CardWrapper className="">
                  <EditableField
                    label="Name"
                    value={user?.displayName}
                    editableField="displayName"
                    onSave={handleOnSave}
                    loading={editLoader}
                  />
                </CardWrapper>

                <CardWrapper className="">
                  <EditableField
                    label="Phone"
                    value={user?.phone}
                    editableField="phone"
                    onSave={handleOnSave}
                    loading={editLoader}
                  />
                </CardWrapper>
                <CardWrapper className="">
                  <EditableField
                    label="Email"
                    value={user?.email as string}
                    editableField="email"
                    onSave={handleOnSave}
                    loading={editLoader}
                  />
                </CardWrapper>

                <CardWrapper className="">
                  <EditableField
                    label="Language"
                    value={user?.language as string}
                    editableField="language"
                    onSave={handleOnSave}
                    loading={editLoader}
                  />
                </CardWrapper>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="flex flex-col gap-4">
                <CardWrapper>
                  <div className="flex justify-between items-center">
                    <BrandImage url={user?.photoURL as string} />
                  </div>
                </CardWrapper>
                <CardWrapper className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-black font-semibold">
                      Job ALerts
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="cursor-pointer px-3 py-2 bg-white text-blue-active border border-[#E4EAF5] rounded-lg">
                      On
                    </button>

                    <button
                      className="cursor-pointer px-3 py-2 bg-white hover:text-blue-active
                 text-[#434343] border border-[#E4EAF5] rounded-lg "
                    >
                      Turn Off
                    </button>
                  </div>
                </CardWrapper>

                <CardWrapper className="flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-2xl text-black font-semibold">
                      Application Status Updates
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="cursor-pointer px-3 py-2 bg-white text-blue-active border border-[#E4EAF5] rounded-lg">
                      On
                    </button>

                    <button
                      className="cursor-pointer px-3 py-2 bg-white hover:text-blue-active
                 text-[#434343] border border-[#E4EAF5] rounded-lg "
                    >
                      Turn Off
                    </button>
                  </div>
                </CardWrapper>

                <CardWrapper className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl text-black font-semibold">
                      App News & Tips
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="cursor-pointer px-3 py-2 bg-white text-blue-active border border-[#E4EAF5] rounded-lg">
                      On
                    </button>

                    <button
                      className="cursor-pointer px-3 py-2 bg-white hover:text-blue-active
                 text-[#434343] border border-[#E4EAF5] rounded-lg "
                    >
                      Turn Off
                    </button>
                  </div>
                </CardWrapper>
              </div>
            )}

            {activeTab === "security" && <SecuritySection />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
