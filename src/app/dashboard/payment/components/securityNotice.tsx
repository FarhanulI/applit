import React from "react";

export default function SecurityNotice() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-2 sm:pt-4">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-lock w-5 h-5 sm:w-6 sm:h-6 text-green-600"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
              Your Payment is Protected
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              All transactions are encrypted with 256-bit SSL security. Your
              payment information is never stored on our servers. We comply with
              PCI DSS standards to ensure your data is always safe.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-shield w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
                <span className="font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-circle-check w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="font-medium">PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
