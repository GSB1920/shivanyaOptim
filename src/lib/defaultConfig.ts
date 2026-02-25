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
};
