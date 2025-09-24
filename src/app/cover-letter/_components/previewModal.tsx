import { Download, ExternalLink, X } from "lucide-react";
import { CoverLetterDoc } from "../utils";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useMemo } from "react";

const PreviewModal = ({
  template,
  isOpen,
  onClose,
}: {
  template: CoverLetterDoc | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // const handleDownload = () => {
  //   if (!template) return;

  //   // Create a temporary anchor element to trigger download
  //   const link = document.createElement("a");
  //   link.href = template.downloadUrl;
  //   link.download = template.fileName + ".pdf";
  //   link.target = "_blank";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleOpenInNewTab = () => {
    if (!template) return;
    window.open(template.downloadUrl, "_blank");
  };

  const pfFile = useMemo(() => {
    const storage = getStorage();
    const pdfRef = ref(storage, template?.downloadUrl);
    return pdfRef;
  }, [template]);

  if (!isOpen || !template) return null;

  console.log({ pfFile });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur  z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={16} />
              Open in New Tab
            </button>
            <button
              // onClick={() => handleDownload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="flex-1 min-h-0">
          {/* <embed
            src='"https://firebasestorage.googleapis.com/v0/b/applymate-a9626.firebasestorage.app/o/Tasks_Requirements_user_payment%20(1).pdf?alt=media'
            type="application/pdf"
            width="100%"
            height="600px"
          /> */}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
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
