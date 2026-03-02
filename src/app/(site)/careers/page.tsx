import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

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
      <HeroSub title="Careers" description="We're hiring—roles opening soon." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <h2 className="text-2xl font-semibold text-midnight_text dark:text-white mb-2">Open Positions</h2>
          <p className="text-muted dark:text-white dark:text-opacity-70">
            We are not actively listing openings here yet. Please email your resume to careers@shivanya-software.com.
          </p>
        </div>
      </section>
    </>
  );
};

export default CareersPage;
