"use client";
import React, { useMemo, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useRouter } from "next/navigation";

type ApplicationStatus = "new" | "reviewed" | "rejected";

type CareerApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resumeLink: string;
  coverLetter: string;
  positionId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

type CareerPosition = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
};

const parsePositions = (value: string | undefined): CareerPosition[] => {
  try {
    const parsed = JSON.parse(value || "[]") as CareerPosition[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => ({
      id: String(item.id || `position-${index + 1}`),
      title: item.title || "",
      location: item.location || "",
      type: item.type || "",
      description: item.description || "",
    }));
  } catch {
    return [];
  }
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const statusStyles: Record<ApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  reviewed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
};

const escapeCsv = (value: string) => `"${String(value || "").replace(/"/g, '""')}"`;

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { config, updateConfig } = useConfig();
  const router = useRouter();
  const [formData, setFormData] = useState(config);
  const [positions, setPositions] = useState<CareerPosition[]>(parsePositions(config.careersPositionsJson));
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");

  React.useEffect(() => {
    setFormData(config);
    setPositions(parsePositions(config.careersPositionsJson));
  }, [config]);

  const positionNameById = useMemo(() => {
    return positions.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.title;
      return acc;
    }, {});
  }, [positions]);

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError("");
    try {
      const res = await fetch("/api/careers/applications", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApplicationsError(data.error || "Failed to load applications.");
        setApplications([]);
      } else {
        setApplications(Array.isArray(data.applications) ? data.applications : []);
      }
    } catch {
      setApplicationsError("Failed to load applications.");
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      void fetchApplications();
    }
  }, [isAuthenticated]);

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    setStatusUpdatingId(applicationId);
    try {
      const res = await fetch("/api/careers/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: applicationId, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Unable to update status.");
      } else {
        setApplications((prev) =>
          prev.map((item) =>
            item.id === applicationId
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item
          )
        );
      }
    } catch {
      alert("Unable to update status.");
    } finally {
      setStatusUpdatingId("");
    }
  };

  const downloadApplicationsCsv = () => {
    const headers = [
      "id",
      "fullName",
      "email",
      "phone",
      "positionId",
      "positionTitle",
      "resumeLink",
      "status",
      "coverLetter",
      "createdAt",
      "updatedAt",
    ];
    const rows = applications.map((application) => [
      application.id,
      application.fullName,
      application.email,
      application.phone,
      application.positionId,
      positionNameById[application.positionId] || "",
      application.resumeLink,
      application.status || "new",
      application.coverLetter,
      application.createdAt,
      application.updatedAt,
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `career-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const addPosition = () => {
    setPositions((prev) => [
      ...prev,
      {
        id: `position-${Date.now()}`,
        title: "",
        location: "",
        type: "",
        description: "",
      },
    ]);
  };

  const updatePosition = (index: number, field: keyof CareerPosition, value: string) => {
    setPositions((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removePosition = (index: number) => {
    setPositions((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@veda.com" && password === "password123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPositions = positions.map((item, index) => {
      const fallback = `position-${index + 1}`;
      const safeTitle = item.title.trim();
      const safeId = slugify(item.id || safeTitle) || fallback;
      return {
        ...item,
        id: safeId,
      };
    });
    const payload = {
      ...formData,
      careersPositionsJson: JSON.stringify(normalizedPositions, null, 2),
    };
    setPositions(normalizedPositions);
    setFormData(payload);
    updateConfig(payload);
    alert("Configuration saved successfully!");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const name = e.target.name as keyof typeof formData;
      setFormData((prev) => ({ ...prev, [name]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthenticated) {
    return (
      <section className="pt-40 pb-20 dark:bg-darkmode min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white dark:bg-midnight_text rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-midnight_text dark:text-white">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                  placeholder="********"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-20 dark:bg-darkmode min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-midnight_text rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-midnight_text dark:text-white border-b pb-4">
            Site Configuration
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Branding & Assets
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Browser Tab Title (Meta Title)
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Logo Image
                  </label>
                  <input
                    type="file"
                    name="logoImage"
                    accept="image/*"
                    onChange={handleFile}
                    className="w-full"
                  />
                  <p className="text-xs text-muted mt-1">Leave empty to use Logo Text</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Favicon
                  </label>
                  <input
                    type="file"
                    name="favicon"
                    accept="image/*,.ico"
                    onChange={handleFile}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Social Profiles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Facebook URL
                  </label>
                  <input type="url" name="facebookUrl" value={formData.facebookUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Twitter URL
                  </label>
                  <input type="url" name="twitterUrl" value={formData.twitterUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    LinkedIn URL
                  </label>
                  <input type="url" name="linkedinUrl" value={formData.linkedinUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Instagram URL
                  </label>
                  <input type="url" name="instagramUrl" value={formData.instagramUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    YouTube URL
                  </label>
                  <input type="url" name="youtubeUrl" value={formData.youtubeUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Office Locations
              </h3>
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Head Office</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Name</label>
                    <input type="text" name="headOfficeName" value={formData.headOfficeName || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Email</label>
                    <input type="email" name="headOfficeEmail" value={formData.headOfficeEmail || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 1</label>
                    <input type="text" name="headOfficeAddress" value={formData.headOfficeAddress || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 2</label>
                    <input type="text" name="headOfficeAddress2" value={formData.headOfficeAddress2 || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Phone</label>
                    <input type="text" name="headOfficePhone" value={formData.headOfficePhone || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                </div>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="space-y-4">
                <h4 className="font-medium text-primary">Branch Office</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Name</label>
                    <input type="text" name="branchOfficeName" value={formData.branchOfficeName || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Email</label>
                    <input type="email" name="branchOfficeEmail" value={formData.branchOfficeEmail || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 1</label>
                    <input type="text" name="branchOfficeAddress" value={formData.branchOfficeAddress || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 2</label>
                    <input type="text" name="branchOfficeAddress2" value={formData.branchOfficeAddress2 || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Phone</label>
                    <input type="text" name="branchOfficePhone" value={formData.branchOfficePhone || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Map Configuration
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Google Maps Embed URL
                </label>
                <input type="text" name="mapEmbedUrl" value={formData.mapEmbedUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                Logo Text
              </label>
              <input
                type="text"
                name="logoText"
                value={formData.logoText}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                Address Line 1
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Hero Descriptions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">About Hero Description</label>
                  <input type="text" name="aboutHeroDescription" value={formData.aboutHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Blog Hero Description</label>
                  <input type="text" name="blogHeroDescription" value={formData.blogHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Careers Page
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Hero Description
                </label>
                <input type="text" name="careersHeroDescription" value={formData.careersHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Intro
                </label>
                <textarea rows={3} name="careersIntro" value={formData.careersIntro || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-dark_border bg-white dark:bg-search p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-midnight_text dark:text-white">
                    Roles Editor
                  </h4>
                  <button
                    type="button"
                    onClick={addPosition}
                    className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-opacity-90"
                  >
                    Add Role
                  </button>
                </div>
                {positions.length === 0 ? (
                  <p className="text-sm text-muted dark:text-white dark:text-opacity-70">
                    No roles yet. Add your first opening.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={`${position.id}-${index}`} className="rounded-lg border border-gray-200 dark:border-dark_border p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-midnight_text dark:text-white">
                            Role {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removePosition(index)}
                            className="px-3 py-1 text-sm rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1 text-midnight_text dark:text-white">Role ID</label>
                            <input type="text" value={position.id} onChange={(event) => updatePosition(index, "id", event.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-midnight_text dark:text-white">Title</label>
                            <input type="text" value={position.title} onChange={(event) => updatePosition(index, "title", event.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-midnight_text dark:text-white">Location</label>
                            <input type="text" value={position.location} onChange={(event) => updatePosition(index, "location", event.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-midnight_text dark:text-white">Type</label>
                            <input type="text" value={position.type} onChange={(event) => updatePosition(index, "type", event.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs font-medium mb-1 text-midnight_text dark:text-white">Description</label>
                          <textarea rows={3} value={position.description} onChange={(event) => updatePosition(index, "description", event.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Portfolio Page
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Hero Description</label>
                <input type="text" name="portfolioHeroDescription" value={formData.portfolioHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Intro</label>
                <textarea rows={3} name="portfolioIntro" value={formData.portfolioIntro || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Portfolio Items JSON</label>
                <textarea rows={10} name="portfolioItemsJson" value={formData.portfolioItemsJson || ""} onChange={handleChange} className="w-full font-mono text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                FAQ Page
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Hero Description</label>
                <input type="text" name="faqHeroDescription" value={formData.faqHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Intro</label>
                <textarea rows={3} name="faqIntro" value={formData.faqIntro || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">FAQ Items JSON</label>
                <textarea rows={10} name="faqItemsJson" value={formData.faqItemsJson || ""} onChange={handleChange} className="w-full font-mono text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">
                Policy Pages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Terms Hero Description</label>
                  <input type="text" name="termsHeroDescription" value={formData.termsHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Privacy Hero Description</label>
                  <input type="text" name="privacyHeroDescription" value={formData.privacyHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Security Hero Description</label>
                  <input type="text" name="securityHeroDescription" value={formData.securityHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Cookie Hero Description</label>
                  <input type="text" name="cookiesHeroDescription" value={formData.cookiesHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">GDPR Hero Description</label>
                  <input type="text" name="gdprHeroDescription" value={formData.gdprHeroDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Terms Content</label>
                <textarea rows={6} name="termsContent" value={formData.termsContent || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Privacy Content</label>
                <textarea rows={6} name="privacyContent" value={formData.privacyContent || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Security Content</label>
                <textarea rows={6} name="securityContent" value={formData.securityContent || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Cookie Content</label>
                <textarea rows={6} name="cookiesContent" value={formData.cookiesContent || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">GDPR Content</label>
                <textarea rows={6} name="gdprContent" value={formData.gdprContent || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  router.push("/");
                }}
                className="px-6 py-3 border border-gray-300 dark:border-dark_border rounded-lg hover:bg-gray-100 dark:hover:bg-darkmode text-midnight_text dark:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </form>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white">
                Career Applications
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void fetchApplications()}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark_border hover:bg-gray-100 dark:hover:bg-darkmode text-midnight_text dark:text-white"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={downloadApplicationsCsv}
                  className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-opacity-90 disabled:opacity-60"
                  disabled={applications.length === 0}
                >
                  Export CSV
                </button>
              </div>
            </div>
            {applicationsLoading ? (
              <p className="text-muted dark:text-white dark:text-opacity-70">Loading applications...</p>
            ) : applicationsError ? (
              <p className="text-red-500">{applicationsError}</p>
            ) : applications.length === 0 ? (
              <p className="text-muted dark:text-white dark:text-opacity-70">No applications yet.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="rounded-lg border border-gray-200 dark:border-dark_border p-4 bg-white dark:bg-search">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <p className="font-semibold text-midnight_text dark:text-white">{application.fullName}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${statusStyles[application.status || "new"]}`}>
                          {application.status || "new"}
                        </span>
                        <p className="text-xs text-muted dark:text-white dark:text-opacity-60">
                          {new Date(application.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted dark:text-white dark:text-opacity-80 mt-2 space-y-1">
                      <p>Email: {application.email}</p>
                      <p>Phone: {application.phone || "N/A"}</p>
                      <p>Position: {positionNameById[application.positionId] || application.positionId || "General application"}</p>
                      <p>
                        Resume:{" "}
                        <a href={application.resumeLink} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                          {application.resumeLink}
                        </a>
                      </p>
                      {application.coverLetter ? <p>Cover letter: {application.coverLetter}</p> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["new", "reviewed", "rejected"] as ApplicationStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void updateApplicationStatus(application.id, status)}
                          disabled={statusUpdatingId === application.id || application.status === status}
                          className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                            application.status === status
                              ? "border-primary text-primary bg-primary/10"
                              : "border-gray-300 dark:border-dark_border hover:bg-gray-100 dark:hover:bg-darkmode text-midnight_text dark:text-white"
                          } disabled:opacity-60`}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
