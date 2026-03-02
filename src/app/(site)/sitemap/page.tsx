import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | Business Template",
  description: "Navigate all key pages of our site.",
};

const SitemapPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/sitemap", text: "Sitemap" },
  ];
  return (
    <>
      <HeroSub title="Sitemap" description="Quick links to main sections." breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <ul className="list-disc pl-6 text-muted dark:text-white dark:text-opacity-70">
            <li><a className="hover:text-primary" href="/services">Services</a></li>
            <li><a className="hover:text-primary" href="/about">About</a></li>
            <li><a className="hover:text-primary" href="/blog">Blog</a></li>
            <li><a className="hover:text-primary" href="/contact">Contact</a></li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default SitemapPage;
