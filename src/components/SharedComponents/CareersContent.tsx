"use client";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

type CareerPosition = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
};

type ApplyState = {
  fullName: string;
  email: string;
  phone: string;
  resumeLink: string;
  coverLetter: string;
  positionId: string;
};

const CareersContent: React.FC = () => {
  const { config } = useConfig();
  const positions = useMemo(() => {
    try {
      const parsed = JSON.parse(config.careersPositionsJson || "[]") as CareerPosition[];
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }, [config.careersPositionsJson]);

  const [formData, setFormData] = useState<ApplyState>({
    fullName: "",
    email: "",
    phone: "",
    resumeLink: "",
    coverLetter: "",
    positionId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/careers/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(result.error || "Unable to submit application right now.");
      } else {
        setSubmitMessage("Application submitted successfully. Our team will contact you soon.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          resumeLink: "",
          coverLetter: "",
          positionId: "",
        });
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="dark:bg-darkmode py-16">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        <p className="text-muted dark:text-white dark:text-opacity-70 mb-10">
          {config.careersIntro}
        </p>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-midnight_text dark:text-white">
              Open Positions
            </h2>
            {positions.length > 0 ? (
              positions.map((position) => (
                <article
                  key={position.id}
                  className="rounded-2xl border border-gray-200 dark:border-dark_border bg-white dark:bg-search p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-midnight_text dark:text-white">
                      {position.title}
                    </h3>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-midnight_text dark:text-white dark:text-opacity-80">
                    {position.location}
                  </p>
                  <p className="text-muted dark:text-white dark:text-opacity-70 mt-4 leading-7">
                    {position.description}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-gray-200 dark:border-dark_border bg-white dark:bg-search p-6">
                <p className="text-muted dark:text-white dark:text-opacity-70">
                  No active openings right now. You can still share your resume at{" "}
                  <Link className="text-primary hover:underline" href={`mailto:${config.email}`}>
                    {config.email}
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-dark_border bg-white dark:bg-search p-6">
            <h2 className="text-2xl font-semibold text-midnight_text dark:text-white mb-5">
              Apply Now
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Full name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
              <select
                value={formData.positionId}
                onChange={(e) => setFormData((prev) => ({ ...prev, positionId: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              >
                <option value="">Select a position (optional)</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </select>
              <input
                type="url"
                required
                value={formData.resumeLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, resumeLink: e.target.value }))}
                placeholder="Resume URL (Drive, LinkedIn, or portfolio)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
              <textarea
                rows={4}
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))
                }
                placeholder="Short cover letter (optional)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
              {submitError ? (
                <p className="text-red-500 text-sm">{submitError}</p>
              ) : null}
              {submitMessage ? (
                <p className="text-green-600 text-sm">{submitMessage}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersContent;
