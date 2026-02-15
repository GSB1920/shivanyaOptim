"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { Heroimage } from "@/app/api/data";

const Hero = () => {
  const leftAnimation = {
    initial: { x: "-20%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-20%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  const rightAnimation = {
    initial: { x: "20%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "20%", opacity: 0 },
    transition: { duration: 0.6 },
  };
  return (
    <section className="relative pt-44 mb-14 bg-cover bg-center dark:bg-darkmode overflow-hidden">
      <div className="w-full h-full absolute z-0 top-0 left-0 hero-pattern-bg animate-grid-move opacity-30"></div>
      <div className="w-full h-full absolute z-0 top-0 left-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-purple-900 dark:opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-yellow-900 dark:opacity-20"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900 dark:opacity-20"></div>
      </div>
      <div className="w-full h-full absolute z-0 top-0 left-0 bg-gradient-to-b from-transparent to-white dark:to-darkmode"></div>
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) relative z-1 md:max-w-(--breakpoint-md) px-4">
        <div className="grid grid-cols-12 items-center">
          <motion.div {...leftAnimation} className="lg:col-span-6 col-span-12">
            <h1 className="md:text-50 sm:text-40 text-28 text-midnight_text lg:text-start mb-9 lg:w-full w-3/4">
              Transforming Business with
              <br />
              <span className="bg-border dark:bg-darkHeroBg  md:text-50 text-36 rounded-lg lg:text-start text-primary max-w-max">
                Digital Excellence
              </span>
              <br />
              software solutions.
            </h1>
            <p className="sm:text-19 text-16 text-muted dark:text-white dark:text-opacity-70 text-start lg:max-w-full sm:max-w-75%">
              We deliver world-class IT consulting, custom software development, and cloud services to help your business grow.
            </p>
            <div className="flex items-center mt-12 gap-11">
              <div>
                <Link
                  href="/services"
                  className="text-17 flex gap-2 items-center bg-primary text-white py-3 px-8 rounded-lg border border-primary hover:text-primary hover:bg-transparent"
                >
                  Our Services
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    width="13"
                    height="13"
                  />
                </Link>
              </div>
              <div>
                <Link
                  href="/contact"
                  className="text-17 flex gap-2 items-center text-muted dark:text-white dark:text-opacity-70 hover:text-primary"
                >
                  Contact Us
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    width="13"
                    height="13"
                  />
                </Link>
              </div>
            </div>

            <div className="lg:my-28 my-12">
              <p className="text-20 text-muted dark:text-white dark:text-opacity-70 text-start mb-7">
                Trusted by Industry Leaders
              </p>
              <div className="w-full overflow-hidden relative">
                <div className="flex space-x-12 animate-marquee whitespace-nowrap">
                  {[...Heroimage, ...Heroimage, ...Heroimage].map((item, index) => (
                    <div key={index} className="inline-block">
                      <Image
                        src={item.lightimage}
                        alt="client logo"
                        width={115}
                        height={30}
                        className="block dark:hidden"
                        style={{ width: "auto", height: "30px" }}
                      />
                      <Image
                        src={item.darkimage}
                        alt="client logo"
                        width={115}
                        height={30}
                        className="hidden dark:block"
                        style={{ width: "auto", height: "30px" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            {...rightAnimation}
            className="lg:col-span-6 col-span-12 pl-20 lg:block hidden"
          >
            <Image
              src="/images/hero/hero-image.png"
              alt="image"
              width={498}
              height={651}
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
