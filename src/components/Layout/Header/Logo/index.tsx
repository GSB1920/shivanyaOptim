"use client";
import Link from "next/link";
import Image from "next/image";
import { useConfig } from "@/context/ConfigContext";
import { useEffect, useState } from "react";

const Logo: React.FC = () => {
  const { config, isLoading } = useConfig();
  const [useText, setUseText] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setUseText(false);
    setImageLoading(!!config.logoImage);
  }, [config.logoImage]);

  return (
    <Link href="/" className="flex items-center">
      {isLoading ? (
        <span className="inline-flex h-8 w-[120px] items-center justify-center">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </span>
      ) : config.logoImage && !useText ? (
        <span className="relative inline-flex h-8 w-[120px] items-center">
          {imageLoading ? (
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : null}
          <Image
            src={config.logoImage}
            alt={config.companyName || "Company Logo"}
            className={`h-8 w-auto object-contain ${imageLoading ? "opacity-0" : "opacity-100"}`}
            onError={() => {
              setUseText(true);
              setImageLoading(false);
            }}
            onLoadingComplete={() => setImageLoading(false)}
            width={120}
            height={32}
          />
        </span>
      ) : (
        <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
          {config.logoText}
        </h2>
      )}
    </Link>
  );
};

export default Logo;
