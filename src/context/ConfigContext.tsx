"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface ConfigData {
  companyName: string;
  logoText: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  favicon?: string;
  logoImage?: string;
  metaTitle?: string;
  // Head Office
  headOfficeName?: string;
  headOfficeAddress?: string;
  headOfficeAddress2?: string;
  headOfficeEmail?: string;
  headOfficePhone?: string;
  // Branch Office
  branchOfficeName?: string;
  branchOfficeAddress?: string;
  branchOfficeAddress2?: string;
  branchOfficeEmail?: string;
  branchOfficePhone?: string;
  // Map
  mapEmbedUrl?: string;
}

interface ConfigContextType {
  config: ConfigData;
  updateConfig: (newConfig: Partial<ConfigData>) => void;
}

const defaultConfig: ConfigData = {
  companyName: "Your Company Name",
  logoText: "YourLogo",
  email: "contact@company.com",
  phone: "+1 234 567 890",
  address: "123 Business Rd",
  addressLine2: "City, Country",
  favicon: "",
  logoImage: "",
  metaTitle: "Company Name - Tagline",
  headOfficeName: "Head Office",
  headOfficeAddress: "123 Business Rd",
  headOfficeAddress2: "City, Zip Code",
  headOfficeEmail: "head@company.com",
  headOfficePhone: "+1 234 567 890",
  branchOfficeName: "Branch Office",
  branchOfficeAddress: "456 Innovation Ave",
  branchOfficeAddress2: "City, Zip Code",
  branchOfficeEmail: "branch@company.com",
  branchOfficePhone: "+1 987 654 321",
  mapEmbedUrl: "",
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigData>(defaultConfig);

  // Load from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("veda_config");
    if (savedConfig) {
      try {
        setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) });
      } catch (e) {
        console.error("Failed to parse config from localStorage", e);
      }
    }
  }, []);

  // Save to localStorage whenever config changes
  const updateConfig = (newConfig: Partial<ConfigData>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem("veda_config", JSON.stringify(updated));
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
