import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PolicyContent from "@/components/SharedComponents/PolicyContent";

export const metadata: Metadata = {
  title: "Terms of Service | Business Template",
  description: "Review our terms and conditions.",
};

const TermsPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/terms", text: "Terms of Service" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Terms of Service"
        descriptionKey="termsHeroDescription"
        fallbackDescription="Legal terms governing use of our website and services."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PolicyContent contentKey="termsContent" />
    </>
  );
};

export default TermsPage;
