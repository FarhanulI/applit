import Image from "next/image";
import React, { FC } from "react";

interface IBrandImage {
  url: string;
}

const BrandImage: FC<IBrandImage> = ({ url }) => {
  return (
    <div className="w-20 h-20 rounded-full overflow-hidden">
      <Image
        alt="Profile Pic"
        src={url || "https://picsum.photos/200"}
        width={80}
        height={80}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default BrandImage;
