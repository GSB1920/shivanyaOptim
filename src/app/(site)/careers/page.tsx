import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import CareersContent from "@/components/SharedComponents/CareersContent";

export const metadata: Metadata = {
  title: "Careers | Business Template",
  description: "Explore career opportunities with us. We are growing fast.",
};

const CareersPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/careers", text: "Careers" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Careers"
        descriptionKey="careersHeroDescription"
        fallbackDescription="Build products and platforms with a high-impact team."
        breadcrumbLinks={breadcrumbLinks}
      />
      <CareersContent />
    </>
  );
};

export default CareersPage;
