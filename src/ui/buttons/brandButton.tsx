/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ButtonHTMLAttributes, FC } from "react";

interface IBrandButton {
  icon?: React.ReactNode;
  label: string;
  classNames?: string
  props?: any
}

const BrandButton: FC<IBrandButton> = ({ icon, label, classNames, ...props }) => {
  return (
    <button
      className={` ${classNames} flex gap-2 px-4 cursor-pointer w-full py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600
               hover:to-purple-700 shadow-lg hover:shadow-xl`}
      {...props}
    >
      {icon}
      {label}
    </button>
  );
};

export default BrandButton;
