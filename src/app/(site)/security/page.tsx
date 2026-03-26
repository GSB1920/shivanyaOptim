import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PolicyContent from "@/components/SharedComponents/PolicyContent";

export const metadata: Metadata = {
  title: "Security | Business Template",
  description: "Our approach to security and compliance.",
};

const SecurityPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/security", text: "Security" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Security"
        descriptionKey="securityHeroDescription"
        fallbackDescription="Best practices to keep your data safe."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PolicyContent contentKey="securityContent" />
    </>
  );
};

export default SecurityPage;
