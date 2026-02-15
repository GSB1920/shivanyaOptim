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
        const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        
        // Remove existing favicon if it's different to force update or prevent duplicates
        // Actually, just updating href is safer, but if Next.js adds a new one, we might have two.
        // Let's find all icon links and remove them, then add ours.
        
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach((link) => {
            if (link.getAttribute('href') !== config.favicon) {
                link.parentNode?.removeChild(link);
            }
        });

        // Check if ours exists now
        const currentLink = document.querySelector(`link[rel*='icon'][href='${config.favicon}']`);
        if (!currentLink) {
            const link = document.createElement("link");
            link.type = "image/x-icon";
            link.rel = "shortcut icon";
            link.href = config.favicon;
            document.getElementsByTagName("head")[0].appendChild(link);
        }
      }
    };

    // Run immediately
    updateMeta();

    // Run after a short delay to override Next.js head updates during navigation
    const timeoutId = setTimeout(updateMeta, 50);
    
    // Also observe head changes to persist favicon
    const observer = new MutationObserver(() => {
        if (config.favicon) {
             const existingLink = document.querySelector(`link[rel*='icon'][href='${config.favicon}']`);
             if (!existingLink) {
                 updateMeta();
             }
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
