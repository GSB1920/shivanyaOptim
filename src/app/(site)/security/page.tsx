import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

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
      <HeroSub title="Security" description="Best practices to keep your data safe." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            Our security policy and certifications will be listed here shortly.
          </p>
        </div>
      </section>
    </>
  );
};

export default SecurityPage;
