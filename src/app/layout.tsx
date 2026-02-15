import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import { ConfigProvider } from "@/context/ConfigContext";
import MetadataUpdater from "@/components/MetadataUpdater";
const dmsans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmsans.className}`}>
        <ConfigProvider>
          <MetadataUpdater />
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
          >
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
