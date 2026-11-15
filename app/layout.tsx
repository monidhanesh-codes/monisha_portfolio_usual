import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ResumeButton from "@/components/ResumeButton";

const urbanistSans = localFont({
  src: [
    {
      path: "../public/fonts/urbanist/static/Urbanist-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/urbanist/static/Urbanist-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-urbanist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Monisha Portfolio",

  keywords: [
    "Product Designer",
    "AI Product Desginer",
    "UX Designer",

  ],

};

export const viewport: Viewport = {
  themeColor: "#0b1528",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${urbanistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <body
        className="min-h-full flex flex-col bg-[#0b1528] text-[#F2F6FA] relative selection:bg-[#72E6E8]/20 selection:text-[#72E6E8]"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      >
        {/* Minimalist Centered Top Navigation — fixed, z-40 */}
        <Navigation />

        {/* Page Content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Floating Fixed Bottom-Right Resume Action — z-40 */}
        <ResumeButton />
      </body>
    </html>
  );
}
