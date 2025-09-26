import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const dropdownRef = useRef(null);
  
  const navigationItems = [
    { label: "How it works", href: "#" },
    { label: "Resume Builder", href: "#" },
    { label: "Why we founded this", href: "#" },
    { label: "Price", href: "#" },
    { label: "Support", href: "#" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenNavs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on window resize (when switching to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setOpenNavs(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white border-b shadow-md border-gray-200 relative">
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
              className="md:block hidden bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 md:px-6 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button - Show on mobile */}
          <div className="lg:hidden relative" ref={dropdownRef}>
            <button
              className="text-gray-600 hover:text-gray-900 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setOpenNavs(!openNavs)}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${openNavs ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {openNavs ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Mobile Navigation Dropdown */}
            {openNavs && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {navigationItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150 font-medium"
                      onClick={() => setOpenNavs(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* Mobile CTA Button */}
                  <div className="px-4 py-2">
                    <button
                      className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white hover:from-blue-600
                       hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                      onClick={() => setOpenNavs(false)}
                    >
                      Start Free Trial
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;