"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const ContactForm = () => {
  return (
    <>
      <section className="dark:bg-darkmode pb-24">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-8">
            <div className="col-span-6">
              <h2 className="max-w-72 text-40 font-bold mb-9">
                Get Online Consultation
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const firstName = (form.querySelector("input[name='firstName']") as HTMLInputElement)?.value?.trim() || "";
                  const lastName = (form.querySelector("input[name='lastName']") as HTMLInputElement)?.value?.trim() || "";
                  const email = (form.querySelector("input[name='email']") as HTMLInputElement)?.value?.trim() || "";
                  const specialist = (form.querySelector("select[name='specialist']") as HTMLSelectElement)?.value || "";
                  const date = (form.querySelector("input[name='date']") as HTMLInputElement)?.value || "";
                  const time = (form.querySelector("input[name='time']") as HTMLInputElement)?.value || "";
                  if (!firstName || !email) {
                    alert("Please enter your first name and email.");
                    return;
                  }
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ firstName, lastName, email, specialist, date, time }),
                    });
                    if (res.ok) {
                      form.reset();
                      alert("Thanks! We'll contact you shortly.");
                    } else {
                      alert("Submission failed. Please try again.");
                    }
                  } catch {
                    alert("Network error. Please try again later.");
                  }
                }}
                className="flex flex-wrap w-full m-auto justify-between"
              >
                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label
                      htmlFor="first-name"
                      className="pb-3 inline-block text-17"
                    >
                      First Name*
                    </label>
                    <input
                      name="firstName"
                      className="w-full text-17 px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white dark:bg-transparent border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                      type="text"
                    />
                  </div>
                  <div className="mx-0 my-2.5 flex-1">
                    <label
                      htmlFor="last-name"
                      className="pb-3 inline-block text-17"
                    >
                      Last Name*
                    </label>
                    <input
                      name="lastName"
                      className="w-full text-17 px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-transparent border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label
                      htmlFor="email"
                      className="pb-3 inline-block text-17"
                    >
                      Email address*
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full text-17 px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-transparent border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0"
                    />
                  </div>
                  <div className="mx-0 my-2.5 flex-1">
                    <label
                      htmlFor="Specialist"
                      className="pb-3 inline-block text-17"
                    >
                      Specialist*
                    </label>
                    <select name="specialist" className="w-full text-17 px-4 py-2.5 rounded-lg border-border dark:text-white border-solid dark:bg-transparent border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0">
                      <option value="">Choose a specialist</option>
                      <option value="Baking &amp; Pastry">
                        Choose a specialist
                      </option>
                      <option value="Exotic Cuisine">Exotic Cuisine</option>
                      <option value="French Desserts">French Desserts</option>
                      <option value="Seafood &amp; Wine">
                        Choose a specialist
                      </option>
                    </select>
                  </div>
                </div>
                <div className="sm:flex gap-3 w-full">
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="date" className="pb-3 inline-block text-17">
                      Date*
                    </label>
                    <input
                      name="date"
                      className="w-full text-17 px-4 rounded-lg  py-2.5 outline-hidden dark:text-white dark:bg-transparent border-border border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                      type="date"
                    />
                  </div>
                  <div className="mx-0 my-2.5 flex-1">
                    <label htmlFor="time" className="pb-3 inline-block text-17">
                      Time*
                    </label>
                    <input
                      name="time"
                      className="w-full text-17 px-4 rounded-lg py-2.5 border-border outline-hidden dark:text-white dark:bg-transparent border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0"
                      type="time"
                    />
                  </div>
                </div>
                <div className="mx-0 my-2.5 w-full">
                  <button
                    className="bg-primary rounded-lg text-white py-4 px-8 mt-4 inline-block hover:bg-blue-700"
                    type="submit"
                  >
                    Make an appointment
                  </button>
                </div>
              </form>
            </div>
            <div className="col-span-6">
              <Image
                src="/images/contact-page/contact.jpg"
                alt="Contact"
                width={1300}
                height={0}
                quality={100}
                style={{ width: "100%", height: "auto" }}
                className="bg-no-repeat bg-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
