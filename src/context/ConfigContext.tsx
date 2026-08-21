"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CONFIG, ConfigData } from "@/lib/defaultConfig";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => Promise<boolean>;
  isLoading: boolean;
  fetchFailed: boolean;
}

const defaultConfig: ConfigData = DEFAULT_CONFIG;
const STORAGE_KEY = "veda_config";

const normalizeConfig = (value: Partial<ConfigData>): ConfigData => ({
  ...defaultConfig,
  ...value,
});

const persistConfigToStorage = (value: ConfigData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return;
  } catch {}

  const reduced: ConfigData = { ...value };
  delete reduced.logoImage;
  delete reduced.favicon;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
};

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
        const res = await fetchWithTimeout("/api/config", { cache: "no-store" }, 10000);
        if (res.ok) {
          const data = await res.json();
          const loaded = normalizeConfig(data);
          if (!active) return;
          setConfig(loaded);
          persistConfigToStorage(loaded);
          setFetchFailed(false);
          return;
        }
        if (active) setFetchFailed(true);
      } catch {
        if (active) setFetchFailed(true);
      }
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (saved) {
        try {
          if (!active) return;
          setConfig(normalizeConfig(JSON.parse(saved)));
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

  const updateConfig = async (newConfig: Partial<ConfigData>) => {
    const updated = normalizeConfig({ ...config, ...newConfig });
    try {
      const res = await fetchWithTimeout(
        "/api/config",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        },
        10000
      );
      if (!res.ok) {
        const details = await res
          .json()
          .catch(async () => ({ error: await res.text().catch(() => "Config save failed") }));
        console.error("Config save failed:", details);
        return false;
      }
      const saved = normalizeConfig(await res.json());
      setConfig(saved);
      persistConfigToStorage(saved);
      setFetchFailed(false);
      return true;
    } catch (err) {
      console.error("Config save failed (network):", err);
      return false;
    }
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
