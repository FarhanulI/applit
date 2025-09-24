"use client";

import { Download, Eye, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CoverLetterDoc, getCoverLetters, handleUserDocuments } from "./utils";
import PreviewModal from "./_components/previewModal";
import { useAuthContext } from "@/contexts/auth";
import { UserStatsType } from "@/lib/file/types";
import { addDocument } from "@/lib/file/apis";
import PageTitle from "@/ui/text/pageTitle";
import CoverLetterCard from "./_components/cover-letter-card";
import FileSkeletonLoader from "@/ui/loaders/fileSkeletonLoader";

const CoverLetter = () => {
  const { user, setUser } = useAuthContext();
  const [templates, seTtemplates] = useState<CoverLetterDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterDoc>();
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
    if (
      !user?.stats?.remainingCoverLetter ||
      user?.stats?.remainingCoverLetter === 0
    ) {
      alert("You Have completed your stock");
      return;
    }

    setDownloadLoading(true);
    const newStats = await handleUserDocuments(user!, setUser);
    console.log({ newStats });
    // if (!newStats) {
    //   setDownloadLoading(false);
    //   return;
    // }

    setUser(newStats as UserStatsType);
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
    setSelectedTemplate(undefined);
  };

  if (loading) {
    return <FileSkeletonLoader />;
  }

  return (
    <div className="">
      <PageTitle
        title="Cover Letters Templates"
        subtitle="Choose from our collection of professional cover letter templates. Pick a design that matches your industry and personal style."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {templates.map((template) => (
          <>
            <CoverLetterCard
              template={template}
              downloadLoading={downloadLoading}
              handlePreview={handlePreview}
              handleDownload={handleDownload}
            />
          </>
        ))}
      </div>

      {selectedTemplate && (
        <PreviewModal
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CoverLetter;
