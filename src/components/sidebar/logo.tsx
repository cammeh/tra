"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <button className="flex px-2 justify-center items-center">
        <Image
          src={theme === "dark" ? "/tra-dark.png" : "/tra.png"}
          width={200}
          height={100}
          alt="logo"
          className="mr-8"
          suppressHydrationWarning
        />
      </button>
    </div>
  );
};

export default Logo;
