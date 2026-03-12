"use client";
import { useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";
import { usePathname } from "next/navigation";

const MetadataUpdater = () => {
  const { config, isLoading, fetchFailed } = useConfig();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (config.metaTitle) {
      document.title = config.metaTitle;
    }

    const head = document.getElementsByTagName("head")[0];
    const resolveTarget = () => {
      const byId = document.getElementById("app-favicon") as HTMLLinkElement | null;
      const firstIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (byId) return byId;
      if (firstIcon) {
        firstIcon.id = "app-favicon";
        return firstIcon;
      }
      const link = document.createElement("link");
      link.id = "app-favicon";
      link.rel = "icon";
      link.type = "image/x-icon";
      head.appendChild(link);
      return link;
    };

    let chosenHref = "";
    const applyFavicon = (href: string) => {
      if (!href) return;
      try {
        const target = resolveTarget();
        if (target.href !== href) {
          target.rel = "icon";
          target.type = "image/x-icon";
          target.href = href;
        }
        chosenHref = href;
      } catch {}
    };

    const fallbackHref = "/favicon.ico";
    const desiredFavicon = (config.favicon || "").trim();
    let imageLoader: HTMLImageElement | null = null;

    if (desiredFavicon) {
      imageLoader = new Image();
      imageLoader.onload = () => applyFavicon(desiredFavicon);
      imageLoader.onerror = () => applyFavicon(fallbackHref);
      imageLoader.src = desiredFavicon;
    } else if (fetchFailed) {
      applyFavicon(fallbackHref);
    }

    const observer = new MutationObserver(() => {
      if (!chosenHref) return;
      const current = document.getElementById("app-favicon") as HTMLLinkElement | null;
      if (!current || current.href !== chosenHref) {
        applyFavicon(chosenHref);
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    return () => {
      if (imageLoader) {
        imageLoader.onload = null;
        imageLoader.onerror = null;
      }
      observer.disconnect();
    };
  }, [config.metaTitle, config.favicon, pathname, isLoading, fetchFailed]);

  return null;
};

export default MetadataUpdater;
