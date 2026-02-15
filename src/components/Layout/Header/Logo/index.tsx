"use client";
import Image from "next/image";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const Logo: React.FC = () => {
  const { config } = useConfig();
  return (
    <Link href="/" className="flex items-center">
      {config.logoImage ? (
        <img
          src={config.logoImage}
          alt={config.companyName}
          className="h-8 w-auto object-contain"
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
