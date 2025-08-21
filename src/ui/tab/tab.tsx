// components/Tabs.tsx
import React, { useState } from "react";

type Tab = {
  id: string;
  title: string;
  content?: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabCount = tabs.length;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key === "ArrowRight") {
      setActiveIndex((index + 1) % tabCount);
    } else if (e.key === "ArrowLeft") {
      setActiveIndex((index - 1 + tabCount) % tabCount);
    }
  };

  return (
    <div className="w-full mx-auto mt-8">
      {/* Tab List */}
      <div role="tablist" aria-label="Tabs" className="flex rounded-md">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`text-sm font-medium text-center transition-colors px-4 py-3 focus:outline-none border border-gray-200
              ${
                activeIndex === index
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }
              flex-1  // Ensures equal width using flex-grow
            `}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className=" p-4  rounded-b-md ">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeIndex !== index}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
