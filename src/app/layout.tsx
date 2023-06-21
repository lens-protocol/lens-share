import "./globals.css";

import { Metadata } from "next";

import { baseUrl } from "@/config";

import { ginto, gintoNord } from "./fonts";

export const metadata: Metadata = {
  title: "Lens Share",
  description: "Share and Explore Lens links Effortlessly",
  metadataBase: new URL(baseUrl),
  openGraph: {
    siteName: "Lens Share",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ginto.variable} ${gintoNord.variable}`}>
      <body>{children}</body>
    </html>
  );
}
