import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

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
      <HeroSub title="Privacy Policy" description="Our commitment to your privacy." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            We value your privacy. This policy will soon detail how we handle personal data.
          </p>
        </div>
      </section>
    </>
  );
};

export default PrivacyPage;
