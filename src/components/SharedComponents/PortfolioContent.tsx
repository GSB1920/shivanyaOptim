"use client";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

type PortfolioItem = {
  title: string;
  industry: string;
  summary: string;
  result: string;
  link?: string;
};

const PortfolioContent: React.FC = () => {
  const { config } = useConfig();
  let items: PortfolioItem[] = [];

  try {
    const parsed = JSON.parse(config.portfolioItemsJson || "[]") as PortfolioItem[];
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  return (
    <section className="dark:bg-darkmode py-16">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        <p className="text-muted dark:text-white dark:text-opacity-70 mb-10">
          {config.portfolioIntro}
        </p>
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-gray-200 dark:border-dark_border p-6 bg-white dark:bg-search"
              >
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {item.industry}
                </span>
                <h3 className="text-2xl font-bold text-midnight_text dark:text-white mt-2">
                  {item.title}
                </h3>
                <p className="text-muted dark:text-white dark:text-opacity-70 mt-4 leading-7">
                  {item.summary}
                </p>
                <p className="text-midnight_text dark:text-white mt-4 font-medium">
                  {item.result}
                </p>
                {item.link ? (
                  <Link
                    href={item.link}
                    className="inline-flex mt-5 text-primary font-semibold hover:underline"
                  >
                    View case study
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted dark:text-white dark:text-opacity-70">
            Portfolio entries will appear here once added from admin.
          </p>
        )}
      </div>
    </section>
  );
};

export default PortfolioContent;
