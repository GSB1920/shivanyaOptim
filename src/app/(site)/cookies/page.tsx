import React from "react";
import { Metadata } from "next";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import PolicyContent from "@/components/SharedComponents/PolicyContent";

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
      <ConfigHeroSub
        title="Cookie Policy"
        descriptionKey="cookiesHeroDescription"
        fallbackDescription="Transparency about cookies used on this site."
        breadcrumbLinks={breadcrumbLinks}
      />
      <PolicyContent contentKey="cookiesContent" />
    </>
  );
};

export default CookiesPage;
