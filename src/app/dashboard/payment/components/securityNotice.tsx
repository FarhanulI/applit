import React from "react";
import { Lock, Shield, CheckCircle2 } from "lucide-react";

export default function SecurityNotice({
  title,
  description,
  sslText,
  pciText,
}: {
  title: string;
  description: string;
  sslText: string;
  pciText: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-medium">{sslText}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">{pciText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
