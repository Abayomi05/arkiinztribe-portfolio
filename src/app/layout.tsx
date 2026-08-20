import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKIINZTRIBE — Digital Experiences That Move Businesses",
  description:
    "ARKIINZTRIBE creates modern websites, software and digital experiences for ambitious businesses.",
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
