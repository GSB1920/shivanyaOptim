import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PolicyContent from "@/components/SharedComponents/PolicyContent";

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
      <ConfigHeroSub
        title="GDPR"
        descriptionKey="gdprHeroDescription"
        fallbackDescription="Our commitment to GDPR compliance."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PolicyContent contentKey="gdprContent" />
    </>
  );
};

export default GdprPage;
