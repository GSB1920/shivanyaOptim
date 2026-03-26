import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PortfolioContent from "@/components/SharedComponents/PortfolioContent";

export const metadata: Metadata = {
  title: "Portfolio | Business Template",
  description: "Showcase of selected projects and case studies.",
};

const PortfolioPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/portfolio", text: "Portfolio" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Portfolio"
        descriptionKey="portfolioHeroDescription"
        fallbackDescription="Case studies and product outcomes from recent engagements."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PortfolioContent />
    </>
  );
};

export default PortfolioPage;
