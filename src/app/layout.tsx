import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ARKIINZTRIBE — Digital Experiences That Move Businesses",
    template: "%s — ARKIINZTRIBE",
  },
  description:
    "ARKIINZTRIBE creates modern websites, software and digital experiences for ambitious businesses.",
  applicationName: "ARKIINZTRIBE",
  keywords: [
    "ARKIINZTRIBE",
    "web development",
    "software development",
    "UI UX design",
    "brand identity",
    "digital studio",
    "Nigeria",
  ],
  authors: [{ name: "ARKIINZTRIBE" }],
  creator: "ARKIINZTRIBE",
  publisher: "ARKIINZTRIBE",

  openGraph: {
    title: "ARKIINZTRIBE — Digital Experiences That Move Businesses",
    description:
      "Modern websites, software and digital experiences for ambitious businesses.",
    siteName: "ARKIINZTRIBE",
    type: "website",
    locale: "en_NG",
  },

  twitter: {
    card: "summary_large_image",
    title: "ARKIINZTRIBE — Digital Experiences That Move Businesses",
    description:
      "Modern websites, software and digital experiences for ambitious businesses.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
