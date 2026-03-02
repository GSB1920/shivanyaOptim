import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Business Template",
  description: "Information about the cookies we use.",
};

const CookiesPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/cookies", text: "Cookie Policy" },
  ];
  return (
    <>
      <HeroSub title="Cookie Policy" description="Transparency about cookies used on this site." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            We will publish details about cookie categories and purposes soon.
          </p>
        </div>
      </section>
    </>
  );
};

export default CookiesPage;
