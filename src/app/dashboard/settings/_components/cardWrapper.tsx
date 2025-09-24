import React, { FC, ReactNode } from "react";

interface ICardWrapper {
  children: ReactNode, className?: string
}

const CardWrapper: FC<ICardWrapper> = ({ children, className }) => {
  return <div className={`bg-[#f5f5f5] rounded-xl px-8 py-5 ${className}`}>{children}</div>;
};

export default CardWrapper;
