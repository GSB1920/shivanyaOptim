"use client";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { useConfig } from "@/context/ConfigContext";
import { ConfigData } from "@/lib/defaultConfig";

type BreadcrumbLink = {
  href: string;
  text: string;
};

interface ConfigHeroSubProps {
  title: string;
  breadcrumbLinks: BreadcrumbLink[];
  descriptionKey: keyof ConfigData;
  fallbackDescription: string;
}

const ConfigHeroSub: React.FC<ConfigHeroSubProps> = ({
  title,
  breadcrumbLinks,
  descriptionKey,
  fallbackDescription,
}) => {
  const { config } = useConfig();
  const description =
    (config[descriptionKey] as string | undefined)?.trim() || fallbackDescription;

  return (
    <HeroSub
      title={title}
      description={description}
      breadcrumbLinks={breadcrumbLinks}
    />
  );
};

export default ConfigHeroSub;
