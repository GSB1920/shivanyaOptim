import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PolicyContent from "@/components/SharedComponents/PolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Business Template",
  description: "Learn how we collect, use, and protect your data.",
};

const PrivacyPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/privacy", text: "Privacy Policy" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Privacy Policy"
        descriptionKey="privacyHeroDescription"
        fallbackDescription="Our commitment to your privacy."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PolicyContent contentKey="privacyContent" />
    </>
  );
};

export default PrivacyPage;
