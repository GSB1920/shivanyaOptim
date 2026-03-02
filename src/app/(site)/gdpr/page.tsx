import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR | Business Template",
  description: "General Data Protection Regulation compliance information.",
};

const GdprPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/gdpr", text: "GDPR" },
  ];
  return (
    <>
      <HeroSub title="GDPR" description="Our commitment to GDPR compliance." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            Detailed GDPR compliance documentation will be available here soon.
          </p>
        </div>
      </section>
    </>
  );
};

export default GdprPage;
