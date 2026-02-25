"use client";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";
import { useState } from "react";

const Logo: React.FC = () => {
  const { config } = useConfig();
  const [useText, setUseText] = useState(false);
  return (
    <Link href="/" className="flex items-center">
      {config.logoImage && !useText ? (
        <img
          src={config.logoImage}
          alt={config.companyName || "Company Logo"}
          className="h-8 w-auto object-contain"
          onError={() => setUseText(true)}
        />
      ) : (
        <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
          {config.logoText}
        </h2>
      )}
    </Link>
  );
};

export default Logo;
