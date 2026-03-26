"use client";
import { useConfig } from "@/context/ConfigContext";

type FaqItem = {
  question: string;
  answer: string;
};

const FaqContent: React.FC = () => {
  const { config } = useConfig();
  let items: FaqItem[] = [];

  try {
    const parsed = JSON.parse(config.faqItemsJson || "[]") as FaqItem[];
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  return (
    <section className="dark:bg-darkmode py-16">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        <p className="text-muted dark:text-white dark:text-opacity-70 mb-8">
          {config.faqIntro}
        </p>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-xl border border-gray-200 dark:border-dark_border p-5 bg-white dark:bg-search"
              >
                <h3 className="text-xl font-semibold text-midnight_text dark:text-white">
                  {item.question}
                </h3>
                <p className="text-muted dark:text-white dark:text-opacity-70 mt-3 leading-7">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted dark:text-white dark:text-opacity-70">
            No FAQs available right now.
          </p>
        )}
      </div>
    </section>
  );
};

export default FaqContent;
