import { Download, ExternalLink, X } from "lucide-react";
import { CoverLetterDoc } from "../utils";
import { useEffect, useState } from "react";
import { ref, getDownloadURL, getBlob } from "firebase/storage";
import { storage } from "@/config/firebase-config";
import { BiEditAlt } from "react-icons/bi";
const PreviewModal = ({
  template,
  isOpen,
  onClose,
}: {
  template: CoverLetterDoc;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleDownload = () => {
    if (!template) return;

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = template.downloadUrl;
    link.download = template.fileName + ".pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!template) return;
    window.open(template.downloadUrl, "_blank");
  };

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const storageRef = ref(
          storage,
          "Tasks_Requirements_user_payment (1).pdf"
        ); // e.g., 'cover_letter/cover_letter_template.pdf'
        const blob = await getBlob(storageRef);
        const url = URL.createObjectURL(blob);
        console.log({ url });

        setPdfUrl(url);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    fetchPDF();

    // Cleanup
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [template.downloadUrl]);

  return (
    <div className="fixed inset-0 rounded-lg bg-black/40 backdrop-blur  z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col ">
        {/* Modal Header */}
        <div className="flex items-center rounded-lg justify-between p-6 border-b border-gray-200 bg-[#EDF5FF]">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {template.fileName}
            </h2>
            <p className="text-sm text-gray-600">
              Category: {template.category}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenInNewTab}
              className="flex rounded-lg border border-[#E4EAF5] items-center cursor-pointer gap-2 px-4 py-2 bg-white text-gray-700  hover:bg-gray-200 transition-colors"
            >
              <BiEditAlt size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDownload()}
              className="flex rounded-lg items-center cursor-pointer gap-2 px-4 py-2  bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 h-2 overflow-hidden">
          <iframe
            src={template.downloadUrl}
            className="w-full h-screen"
            title="PDF Viewer"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex rounded-lg items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created:</span>{" "}
            {new Date(template.createdAt).toLocaleDateString()}
            <span className="ml-4 font-medium">Status:</span>
            <span
              className={`ml-1 px-2 py-1 rounded-full text-xs ${
                template.correction_status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {template.correction_status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
