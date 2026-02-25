"use client";
import { useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";
import { usePathname } from "next/navigation";

const MetadataUpdater = () => {
  const { config } = useConfig();
  const pathname = usePathname();

  useEffect(() => {
    const updateMeta = () => {
      // Update Title (only if set)
      if (config.metaTitle) {
        document.title = config.metaTitle;
      }

      // Update Favicon
      if (config.favicon) {
        try {
          const head = document.getElementsByTagName("head")[0];
          const byId = document.getElementById("app-favicon") as HTMLLinkElement | null;
          const firstIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
          const target = byId || firstIcon;
          if (target) {
            if (target.href !== config.favicon) {
              target.rel = "icon";
              target.type = "image/x-icon";
              target.href = config.favicon;
              if (!byId) target.id = "app-favicon";
            }
          } else {
            const link = document.createElement("link");
            link.id = "app-favicon";
            link.rel = "icon";
            link.type = "image/x-icon";
            link.href = config.favicon;
            head.appendChild(link);
          }
        } catch {}
      }
    };

    // Run immediately
    updateMeta();

    // Run after a short delay to override Next.js head updates during navigation
    const timeoutId = setTimeout(updateMeta, 50);
    
    // Also observe head changes to persist favicon
    const observer = new MutationObserver(() => {
      if (!config.favicon) return;
      const byId = document.getElementById("app-favicon") as HTMLLinkElement | null;
      if (!byId || byId.href !== config.favicon) {
        updateMeta();
      }
    });
    
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });

    return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
    };
  }, [config.metaTitle, config.favicon, pathname]);

  return null;
};

export default MetadataUpdater;
