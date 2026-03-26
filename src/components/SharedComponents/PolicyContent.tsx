"use client";
import { useConfig } from "@/context/ConfigContext";
import { ConfigData } from "@/lib/defaultConfig";

interface PolicyContentProps {
  contentKey: keyof ConfigData;
}

const PolicyContent: React.FC<PolicyContentProps> = ({ contentKey }) => {
  const { config } = useConfig();
  const content = (config[contentKey] as string | undefined) || "";
  const blocks = content
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="dark:bg-darkmode py-16">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        {blocks.length > 0 ? (
          <div className="space-y-5">
            {blocks.map((block, index) => (
              <p
                key={index}
                className="text-muted dark:text-white dark:text-opacity-70 leading-8"
              >
                {block}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted dark:text-white dark:text-opacity-70">
            Content is being updated. Please check back shortly.
          </p>
        )}
      </div>
    </section>
  );
};

export default PolicyContent;
