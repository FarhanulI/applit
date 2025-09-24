import { ChevronDown } from "lucide-react";
import { useState } from "react";
import MainLogo from "../svgs/mainLogo";

const LanguageDropDown = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <img
          src="https://flagcdn.com/w20/us.png"
          alt="US Flag"
          className="w-5 h-4 rounded-sm"
        />
        <span className="font-medium">English</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isLanguageOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Language Dropdown */}
      {isLanguageOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <img
                src="https://flagcdn.com/w20/us.png"
                alt="US"
                className="w-5 h-4 rounded-sm"
              />
              <span>English</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <img
                src="https://flagcdn.com/w20/es.png"
                alt="ES"
                className="w-5 h-4 rounded-sm"
              />
              <span>Español</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <img
                src="https://flagcdn.com/w20/fr.png"
                alt="FR"
                className="w-5 h-4 rounded-sm"
              />
              <span>Français</span>
            </button>
            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <img
                src="https://flagcdn.com/w20/de.png"
                alt="DE"
                className="w-5 h-4 rounded-sm"
              />
              <span>Deutsch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [openNavs, setOpenNavs] = useState(false);
  const navigationItems = [
    { label: "How it works", href: "#" },
    { label: "Resume Builder", href: "#" },
    { label: "Why we founded this", href: "#" },
    { label: "Price", href: "#" },
    { label: "Support", href: "#" },
  ];

  return (
    <header className="bg-white border-b shadow-md border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <MainLogo />
          </div>

          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8 border px-3 py-1 rounded-md border-[#E1E7F0]">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-blue-active transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side - Language selector and CTA */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageDropDown />
            {/* CTA Button */}
            <button
              className=" bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button - Show on mobile */}
          <div className="lg:hidden">
            <button
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => setOpenNavs(!openNavs)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-200 ${
          openNavs ? "block" : "hidden"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
