"use client";
import React from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const Location = () => {
  const { config } = useConfig();
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
  ];
  return (
    <>
      <section className="bg-primary py-24">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
            <div className="">
                {/* Head Office */}
                <div className="grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 border-b border-solid border-white border-opacity-50 pb-11">
                    <div className="col-span-3">
                        <h2 className="text-white max-w-56 text-40 font-bold">{config.headOfficeName || "Pune Head Office"}</h2>
                    </div>
                    <div className="col-span-3">
                        <p className="sm:text-24 text-xl text-IceBlue font-normal max-w-64 leading-10 text-white text-opacity-50">
                          {config.headOfficeAddress}
                          <br />
                          {config.headOfficeAddress2}
                        </p>
                    </div>
                    <div className="col-span-3">
                        <Link href={`mailto:${config.headOfficeEmail}`} className="sm:text-24 text-xl text-white font-medium underline block mb-2">{config.headOfficeEmail}</Link>
                        <Link href={`tel:${config.headOfficePhone}`} className="sm:text-24 text-xl text-white text-opacity-80 flex items-center gap-2 hover:text-opacity-100 w-fit"><span className="text-white text-opacity-40!">Call</span>{config.headOfficePhone}</Link>
                    </div>
                </div>
                
                {/* Branch Office */}
                <div className="grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 pt-12">
                    <div className="col-span-3">
                        <h2 className="text-white max-w-52 text-40 font-bold">{config.branchOfficeName || "Bengaluru Office"}</h2>
                    </div>
                    <div className="col-span-3">
                        <p className="sm:text-24 text-xl text-white text-opacity-50 font-normal max-w-64 leading-10">
                          {config.branchOfficeAddress}
                          <br />
                          {config.branchOfficeAddress2}
                        </p>
                    </div>
                    <div className="col-span-3">
                        <Link href={`mailto:${config.branchOfficeEmail}`} className="sm:text-24 text-xl text-white font-medium underline block mb-2">{config.branchOfficeEmail}</Link>
                        <Link href={`tel:${config.branchOfficePhone}`} className="sm:text-24 text-white text-opacity-80 text-xl text-IceBlue flex items-center gap-2 hover:text-opacity-100 w-fit"><span className="text-white text-opacity-40!">Call</span>{config.branchOfficePhone}</Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Location;
