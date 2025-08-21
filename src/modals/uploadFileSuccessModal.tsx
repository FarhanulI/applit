/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ArrowRight, CheckCircle, Shield, X } from "lucide-react";
                
// @ts-ignore
const UploadSuccessPopup = ({ isOpen, onClose, fileName, onRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 pb-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            CV Uploaded Successfully! 🎉
          </h3>

          <p className="text-gray-600 mb-1">
            <strong className="text-blue-600">{fileName}</strong> has been
            uploaded and is ready for processing.
          </p>

          {/* Registration Required Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 my-6">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div className="text-left">
                <p className="text-blue-800 font-semibold text-sm mb-1">
                  Registration Required to Continue
                </p>
                <p className="text-blue-700 text-sm">
                  Create your account to unlock CV analysis and cover letter
                  generation.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits of Registration */}
          <div className="text-left mb-6 bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 font-semibold text-sm mb-3 text-center">
              ✨ What you&#39;ll get after registration:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>AI-powered CV analysis & scoring</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Personalized improvement suggestions</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>German-standard cover letter generation</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>Smart job matching recommendations</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              onClick={onRegister}
            >
              <span>Create Free Account & Continue</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Elements */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-blue-500" />
                <span>No Spam</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center">
                <span>🚀 Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccessPopup;
