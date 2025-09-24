import React, { FC } from "react";
import SpinLoader from "../loaders/spinLoader";

interface IButton {
  label: string;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button: FC<IButton> = ({
  label,
  isLoading,
  className,
  onClick,
  type,
}) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={className}
      onClick={onClick}
    >
      {isLoading ? <SpinLoader /> : label}
    </button>
  );
};

export default Button;
