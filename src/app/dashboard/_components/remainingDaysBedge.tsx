// components/RemainingDaysBadge.tsx
import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
  remainingDays: number;
}

const RemainingDaysBadge: React.FC<Props> = ({ remainingDays }) => {
  let styleClasses = "";
  let Icon = CheckCircle;

  if (remainingDays < 10) {
    styleClasses = "bg-red-100 text-red-800 border-red-200 animate-pulse";
    Icon = AlertCircle;
  } else if (remainingDays < 30) {
    styleClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";
    Icon = AlertTriangle;
  } else {
    styleClasses = "bg-green-100 text-green-800 border-green-200";
    Icon = CheckCircle;
  }

  return (
    <div
      className={`w-[10rem] flex items-center gap-3 px-3 py-1.5 rounded-full border text-sm font-medium  ${styleClasses}`}
    >
      <Icon className="w-4 h-4" />
      <p className="flex">{remainingDays} days</p>
    </div>
  );
};

export default RemainingDaysBadge;
