import React, { FC } from "react";
import { CoverLetterDoc } from "../utils";
import { Download, Eye } from "lucide-react";

interface ICoverLetterCard {
  template: CoverLetterDoc;
  handlePreview: (template: CoverLetterDoc) => void;
  downloadLoading: boolean;
  handleDownload: (template: CoverLetterDoc) => Promise<void>;
}

const CoverLetterCard: FC<ICoverLetterCard> = ({
  template,
  downloadLoading,
  handleDownload,
  handlePreview,
}) => {
  return (
    <div
      key={template.id}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Template Preview */}
      <div className={`relative h-64 p-4 `}>
        {/* Mock document content */}
        <div
          className={`w-full h-full rounded shadow-sm p-3 bg-background-main text-gray-900`}
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
        <div
          className="absolute inset-0 bg-black bg-opacity-50 opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 flex items-center
         justify-center space-x-3"
        >
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

        <span className="text-sm px-2 py-1 bg-[#EDF5FF] text-gray-600 rounded-full border border-border-main absolute top-7 right-7">
          {template.category}
        </span>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {template.fileName}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Modern creative template ideal for marketing and design professionals.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">Professional</p>
      </div>
    </div>
  );
};

export default CoverLetterCard;
