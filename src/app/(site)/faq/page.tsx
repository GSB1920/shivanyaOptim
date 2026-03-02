import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Business Template",
  description: "Frequently asked questions about our services.",
};

const FaqPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/faq", text: "FAQs" },
  ];
  return (
    <>
      <HeroSub title="FAQs" description="Answers to common questions." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <p className="text-muted dark:text-white dark:text-opacity-70">
            We are compiling the most common questions from clients. Content coming soon.
          </p>
        </div>
      </section>
    </>
  );
};

export default FaqPage;
