import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import FaqContent from "@/components/SharedComponents/FaqContent";

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
      <ConfigHeroSub
        title="FAQs"
        descriptionKey="faqHeroDescription"
        fallbackDescription="Answers to common questions."
        breadcrumbLinks={breadcrumbLinks}
      />
      <FaqContent />
    </>
  );
};

export default FaqPage;
