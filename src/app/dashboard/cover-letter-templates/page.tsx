"use client";

import { Download, Eye, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CoverLetterDoc, getCoverLetters, handleUserDocuments } from "./utils";
import PreviewModal from "./_components/previewModal";
import { useAuthContext } from "@/contexts/auth";
import { UserStatsType } from "@/lib/file/types";
import { addDocument } from "@/lib/file/apis";

const CoverLetter = () => {
  const { userStats, user, setUserStats } = useAuthContext();
  const [templates, seTtemplates] = useState<CoverLetterDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<CoverLetterDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    const loadDocs = async () => {
      const docs = await getCoverLetters();
      console.log({ docs });
      seTtemplates(docs);
      setLoading(false);
    };

    loadDocs();
  }, []);

  const handlePreview = (template: CoverLetterDoc) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDownload = async (template: CoverLetterDoc) => {
    setDownloadLoading(true);
    const newStats = await handleUserDocuments(user!, userStats!);
    console.log({ newStats });
    if (!newStats) {
      setDownloadLoading(false);
      return;
    }

    setUserStats(newStats as UserStatsType);
    setDownloadLoading(false);

    const link = document.createElement("a");

    link.href = template.downloadUrl;
    link.download = template.fileName; // don't add .pdf manually
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await addDocument(user!, template);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Cover Letter Templates
      </h1>
      <p className="text-gray-600 text-lg mb-6">
        Choose from our collection of professional cover letter templates. Pick
        a design that matches your industry and personal style.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Template Preview */}
            <div
              className={`relative h-64 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200`}
            >
              {/* {template.featured && (
              <div className="absolute top-2 right-2 z-10">
                <Star className="text-yellow-500 fill-current" size={20} />
              </div>
            )} */}

              {/* Mock document content */}
              <div
                className={`w-full h-full rounded shadow-sm p-3 bg-white text-gray-900`}
              >
                <div className="space-y-2">
                  <div className="h-4 bg-gray-900 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-400 rounded w-1/2"></div>
                  <div className="space-y-1 mt-4">
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                  </div>
                  <div className="space-y-1 mt-3">
                    <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-600 rounded w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                <button
                  onClick={() => handlePreview(template)}
                  className="bg-white cursor-pointer text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
                  title="Preview PDF"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleDownload(template)}
                  className="bg-blue-600 cursor-pointer text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  {downloadLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {template.fileName}
                </h3>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Modern creative template ideal for marketing and design
                professionals.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Professional
              </p>
            </div>
          </div>
        ))}
      </div>

      <PreviewModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CoverLetter;
