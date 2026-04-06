"use client";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";
import { useEffect, useState } from "react";

const Logo: React.FC = () => {
  const { config, isLoading } = useConfig();
  const [useText, setUseText] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const logoSrc = config.logoImage || "";
  const showSpinner = Boolean(logoSrc) && loadedSrc !== logoSrc;

  useEffect(() => {
    setUseText(false);
  }, [config.logoImage]);

  return (
    <Link href="/" className="flex items-center">
      {isLoading ? (
        <span className="inline-flex h-[10vh] w-[180px] items-center justify-center">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </span>
      ) : config.logoImage && !useText ? (
        <span className="relative inline-flex items-center">
          {showSpinner ? (
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : null}
          <img
            src={logoSrc}
            alt={config.companyName || "Company Logo"}
            className={`transition-opacity ${showSpinner ? "opacity-0" : "opacity-100"}`}
            style={{ height: "7vh", width: "auto", objectFit: "contain" }}
            onLoad={() => setLoadedSrc(logoSrc)}
            onError={() => {
              setUseText(true);
              setLoadedSrc(null);
            }}
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
