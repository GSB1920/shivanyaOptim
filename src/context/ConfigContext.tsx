"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CONFIG, ConfigData } from "@/lib/defaultConfig";

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => void;
}

const defaultConfig: ConfigData = DEFAULT_CONFIG;

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigData>(defaultConfig);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setConfig({ ...defaultConfig, ...data });
          localStorage.setItem("veda_config", JSON.stringify(data));
          return;
        }
      } catch {}
      const saved = localStorage.getItem("veda_config");
      if (saved) {
        try {
          setConfig({ ...defaultConfig, ...JSON.parse(saved) });
        } catch {}
      }
    };
    load();
  }, []);

  const updateConfig = (newConfig: Partial<ConfigData>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem("veda_config", JSON.stringify(updated));
    try {
      fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
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
