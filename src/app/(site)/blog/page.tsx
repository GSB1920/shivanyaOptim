import React from "react";
import BlogList from "@/components/Blog/BlogList";
import ConfigHeroSub from "@/components/SharedComponents/ConfigHeroSub";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog | Nicktio",
};

const Page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/blog", text: "Blog" },
  ];
  return (
    <>
      <ConfigHeroSub
        title="Blog"
        descriptionKey="blogHeroDescription"
        fallbackDescription="Insights, stories, and updates from our team."
        breadcrumbLinks={breadcrumbLinks}  
      />
      <BlogList />
    </>
  );
};

export default Page;
