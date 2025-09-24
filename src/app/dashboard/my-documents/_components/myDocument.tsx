/* eslint-disable @typescript-eslint/ban-ts-comment */
import PreviewModal from "@/app/cover-letter/_components/previewModal";
import { CoverLetterDoc } from "@/app/cover-letter/utils";
import { useAuthContext } from "@/contexts/auth";
import { fetchDocuments } from "@/lib/file/apis";
import { UserCvDocument } from "@/lib/file/types";
import FileSkeletonLoader from "@/ui/loaders/fileSkeletonLoader";
import FileSkeleton from "@/ui/skeleton/fileSkeleton";
import { Download, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";

interface IMyDocument {
  type: string;
}

const MyDocument = ({ type }: IMyDocument) => {
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState<UserCvDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CoverLetterDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = (template: CoverLetterDoc) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDownload = async (template: CoverLetterDoc) => {
    const link = document.createElement("a");

    link.href = template.downloadUrl;
    link.download = template.fileName; // don't add .pdf manually
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const loadDocs = async () => {
      if (user) {
        const docs = await fetchDocuments(user?.uid, type);
        setDocuments(docs);
      }
      setLoading(false);
    };

    loadDocs();
  }, [user, type]);

  if (loading) {
    return <FileSkeletonLoader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((template) => (
        <div
          key={template.id}
          className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Template Preview */}
          <div
            className={`relative h-64 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200`}
          >
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
                // @ts-ignore
                onClick={() => handlePreview(template)}
                className="bg-white cursor-pointer text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
                title="Preview PDF"
              >
                <Eye size={18} />
              </button>
              <button
                // @ts-ignore
                onClick={() => handleDownload(template)}
                className="bg-blue-600 cursor-pointer text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
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
                {/* @ts-ignore */}
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

      <PreviewModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default MyDocument;
