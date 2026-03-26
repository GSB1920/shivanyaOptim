export interface ConfigData {
  companyName: string;
  logoText: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  favicon?: string;
  logoImage?: string;
  metaTitle?: string;
  headOfficeName?: string;
  headOfficeAddress?: string;
  headOfficeAddress2?: string;
  headOfficeEmail?: string;
  headOfficePhone?: string;
  branchOfficeName?: string;
  branchOfficeAddress?: string;
  branchOfficeAddress2?: string;
  branchOfficeEmail?: string;
  branchOfficePhone?: string;
  mapEmbedUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  aboutHeroDescription?: string;
  blogHeroDescription?: string;
  careersHeroDescription?: string;
  careersIntro?: string;
  careersPositionsJson?: string;
  portfolioHeroDescription?: string;
  portfolioIntro?: string;
  portfolioItemsJson?: string;
  faqHeroDescription?: string;
  faqIntro?: string;
  faqItemsJson?: string;
  termsHeroDescription?: string;
  termsContent?: string;
  privacyHeroDescription?: string;
  privacyContent?: string;
  securityHeroDescription?: string;
  securityContent?: string;
  cookiesHeroDescription?: string;
  cookiesContent?: string;
  gdprHeroDescription?: string;
  gdprContent?: string;
}

export const DEFAULT_CONFIG: ConfigData = {
  companyName: "Your Company Name",
  logoText: "YourLogo",
  email: "contact@company.com",
  phone: "+1 234 567 890",
  address: "123 Business Rd",
  addressLine2: "City, Country",
  favicon: "",
  logoImage: "",
  metaTitle: "Company Name - Tagline",
  headOfficeName: "Head Office",
  headOfficeAddress: "123 Business Rd",
  headOfficeAddress2: "City, Zip Code",
  headOfficeEmail: "head@company.com",
  headOfficePhone: "+1 234 567 890",
  branchOfficeName: "Branch Office",
  branchOfficeAddress: "456 Innovation Ave",
  branchOfficeAddress2: "City, Zip Code",
  branchOfficeEmail: "branch@company.com",
  branchOfficePhone: "+1 987 654 321",
  mapEmbedUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  aboutHeroDescription: "Learn about our mission, people, and values.",
  blogHeroDescription: "Insights, updates, and product thinking from our team.",
  careersHeroDescription: "Build products users love with a high-ownership team.",
  careersIntro: "We hire thoughtful builders who care about product quality and customer outcomes.",
  careersPositionsJson: JSON.stringify(
    [
      {
        id: "senior-frontend-engineer",
        title: "Senior Frontend Engineer",
        location: "Remote",
        type: "Full-time",
        description: "Build scalable UI systems in React and Next.js with strong performance and UX standards."
      },
      {
        id: "product-designer",
        title: "Product Designer",
        location: "Hybrid",
        type: "Full-time",
        description: "Design intuitive user journeys from discovery through polished delivery."
      }
    ],
    null,
    2
  ),
  portfolioHeroDescription: "Selected work delivering measurable product and business outcomes.",
  portfolioIntro: "Explore examples of how we ship reliable software and improve customer experience.",
  portfolioItemsJson: JSON.stringify(
    [
      {
        title: "Global Payments Dashboard",
        industry: "FinTech",
        summary: "Rebuilt reporting and reconciliation workflows for enterprise finance teams.",
        result: "Reduced reconciliation time by 42%.",
        link: ""
      },
      {
        title: "Digital Care Platform",
        industry: "HealthTech",
        summary: "Launched a secure patient portal and appointment journey.",
        result: "Increased monthly active users by 2.3x.",
        link: ""
      }
    ],
    null,
    2
  ),
  faqHeroDescription: "Answers to common questions about our services and process.",
  faqIntro: "If your question is not listed here, contact us and we will help quickly.",
  faqItemsJson: JSON.stringify(
    [
      {
        question: "How long does a typical project take?",
        answer: "Timelines depend on scope, but most MVPs ship within 8-14 weeks."
      },
      {
        question: "Do you work with in-house teams?",
        answer: "Yes, we often work as an embedded team with product and engineering leaders."
      }
    ],
    null,
    2
  ),
  termsHeroDescription: "Legal terms governing use of our website and services.",
  termsContent:
    "By using this website, you agree to our terms and conditions.\n\nAll materials are provided as-is without warranties unless otherwise specified in writing.\n\nFor commercial engagements, signed service agreements supersede these website terms.",
  privacyHeroDescription: "Our commitment to protecting your personal information.",
  privacyContent:
    "We collect only the data needed to provide and improve our services.\n\nWe never sell personal information and only share with trusted processors when required.\n\nYou may request access, correction, or deletion by contacting us.",
  securityHeroDescription: "Security practices and controls used to protect systems and data.",
  securityContent:
    "We follow secure development practices, least-privilege access, and continuous monitoring.\n\nInfrastructure access is restricted and audited.\n\nReport security concerns to our team for a coordinated response.",
  cookiesHeroDescription: "Transparency about how and why cookies are used on this website.",
  cookiesContent:
    "Cookies help maintain site functionality, analytics, and user preferences.\n\nYou can manage cookie preferences through browser settings.\n\nDisabling some cookies may impact parts of the site experience.",
  gdprHeroDescription: "How we align with GDPR principles in handling personal data.",
  gdprContent:
    "We process personal data lawfully, transparently, and for specific purposes.\n\nWe support data subject rights including access, rectification, erasure, and portability.\n\nContact us for GDPR-related requests and compliance documentation."
};
