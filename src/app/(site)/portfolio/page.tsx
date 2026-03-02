import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

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
      <HeroSub title="Portfolio" description="Case studies and success stories coming soon." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            We are curating our portfolio. Check back soon for detailed case studies.
          </p>
        </div>
      </section>
    </>
  );
};

export default PortfolioPage;
