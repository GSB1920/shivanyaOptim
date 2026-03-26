"use client";
import { FormEvent, useState } from "react";

const NewsletterSubscribeCard: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setMessage("Subscribed successfully");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Subscription failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-12 px-11 bg-white dark:bg-dark_b shadow-lg rounded-b-lg">
      <p className="text-24 mb-4">Join our Newsletter</p>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="p-3 dark:bg-search border border-border dark:border-dark_border rounded-lg mb-2 w-full focus:outline-0 focus:border-primary dark:focus:border-primary"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary w-full px-7 border text-base text-white border-primary py-4 rounded-sm hover:bg-transparent hover:text-primary disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Subscribe"}
        </button>
      </form>
      {message ? (
        <p className="text-green-600 text-sm mt-3">{message}</p>
      ) : null}
      {error ? <p className="text-red-500 text-sm mt-3">{error}</p> : null}
    </div>
  );
};

export default NewsletterSubscribeCard;
