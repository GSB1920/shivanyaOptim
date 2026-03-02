import React from "react";
import HeroSub from "@/components/SharedComponents/HeroSub";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Business Template",
  description: "Learn about our mission, team, and the way we deliver value.",
};

const AboutPage = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
  ];
  return (
    <>
      <HeroSub title="About Us" description="" breadcrumbLinks={breadcrumbLinks} />
      <section className="dark:bg-darkmode py-16">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
            <div>
              <h2 className="text-36 font-bold text-midnight_text dark:text-white mb-4">
                Transforming Business with Digital Excellence
              </h2>
              <p className="text-muted dark:text-white dark:text-opacity-70 text-17 mb-6">
                We deliver world-class IT consulting, custom software development, and cloud services to help your business grow.
              </p>
              <p className="text-muted dark:text-white dark:text-opacity-70 text-17 mb-6">
                Our expert team ensures your software is built on solid foundations, allowing you to focus on your core business.
              </p>
              <div className="flex gap-4">
                <Link href="/services" className="text-17 bg-primary text-white py-3 px-8 rounded-lg border border-primary hover:text-primary hover:bg-transparent">
                  View Services
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image src="/images/hero/hero-image.png" alt="About" width={498} height={651} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
