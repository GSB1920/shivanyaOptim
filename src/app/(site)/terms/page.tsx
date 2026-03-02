import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

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
      <HeroSub title="Terms of Service" description="Legal terms governing use of our website and services." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            This page outlines the terms of service. Detailed content will be published soon.
          </p>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
