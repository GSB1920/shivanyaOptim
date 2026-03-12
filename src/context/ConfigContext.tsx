"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CONFIG, ConfigData } from "@/lib/defaultConfig";

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => void;
  isLoading: boolean;
  fetchFailed: boolean;
}

const defaultConfig: ConfigData = DEFAULT_CONFIG;

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigData>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!active) return;
          setConfig({ ...defaultConfig, ...data });
          localStorage.setItem("veda_config", JSON.stringify(data));
          setFetchFailed(false);
          return;
        }
        if (active) setFetchFailed(true);
      } catch {
        if (active) setFetchFailed(true);
      }
      const saved = localStorage.getItem("veda_config");
      if (saved) {
        try {
          if (!active) return;
          setConfig({ ...defaultConfig, ...JSON.parse(saved) });
        } catch {}
      }
    };
    void load().finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const updateConfig = (newConfig: Partial<ConfigData>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem("veda_config", JSON.stringify(updated));
    void fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then(async (res) => {
        if (!res.ok) {
          const details = await res.json().catch(() => ({}));
          console.error("Config save failed:", details);
        }
      })
      .catch((err) => {
        console.error("Config save failed (network):", err);
      });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isLoading, fetchFailed }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
