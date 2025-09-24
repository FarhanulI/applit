"use client"

import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface IInput {
  label: string;
  value: string;
  id?: string;
  name: string;
  type: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const Input = ({
  id,
  label,
  name,
  type,
  value,
  error,
  onChange,
  required,
  placeholder,
}: IInput) => {
  const [showPassword, setshowPassword] = useState<boolean>(false);
  return (
    <div className="relative">
      <label className="block text-md font-semibold text-[#27292A]  mb-2">
        {label}
      </label>

      {type === "password" ? (
        <input
          id={id}
          type={showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-black/60 px-4 py-3 border border-[#B4B4B4] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-black/60 px-4 py-3 border border-[#B4B4B4] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder={placeholder}
          required={required}
        />
      )}

      {type === "password" && (
        <button
          type="button"
          className="absolute top-[37%] inset-y-0 right-0 pr-3 flex items-center text-black cursor-pointer"
          onClick={() => setshowPassword(!showPassword)}
        >
          {!showPassword ? <BsEyeSlash /> : <BsEye />}
        </button>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
