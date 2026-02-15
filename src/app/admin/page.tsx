"use client";
import React, { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { config, updateConfig } = useConfig();
  const router = useRouter();

  // Temporary state for form fields to avoid constant re-renders/writes to localstorage on every keystroke
  const [formData, setFormData] = useState(config);

  // Sync formData when config loads
  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials as requested
    if (email === "admin@veda.com" && password === "password123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    alert("Configuration saved successfully!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-midnight_text rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-midnight_text dark:text-white border-b pb-4">
            Site Configuration
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Branding Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">Branding & Assets</h3>
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
                  placeholder="e.g. Veda Innovations - Top Software Firm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    name="logoImage"
                    value={formData.logoImage || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-muted mt-1">Leave empty to use Logo Text</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    name="favicon"
                    value={formData.favicon || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">Office Locations</h3>
              
              {/* Head Office */}
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
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 2 (Zip)</label>
                    <input type="text" name="headOfficeAddress2" value={formData.headOfficeAddress2 || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Phone</label>
                    <input type="text" name="headOfficePhone" value={formData.headOfficePhone || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Branch Office */}
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
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Address Line 2 (Zip)</label>
                    <input type="text" name="branchOfficeAddress2" value={formData.branchOfficeAddress2 || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">Phone</label>
                    <input type="text" name="branchOfficePhone" value={formData.branchOfficePhone || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Configuration */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-midnight_text dark:text-white border-b pb-2">Map Configuration</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-midnight_text dark:text-white">
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  name="mapEmbedUrl"
                  value={formData.mapEmbedUrl || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:border-dark_border dark:text-white"
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-xs text-muted mt-1">Paste the 'src' attribute from the Google Maps Embed code.</p>
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
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
