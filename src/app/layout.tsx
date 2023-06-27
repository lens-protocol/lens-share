import "./globals.css";

import { Metadata } from "next";
import Image from "next/image";

import { Navigation } from "@/components/navigation";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${ginto.variable} ${gintoNord.variable}`}>
      <body className="h-full bg-dark">
        <div className="mt-6 flex flex-row w-full justify-center absolute">
          <Navigation />
        </div>

        <main className="flex h-full flex-col justify-end items-stretch sm:items-center sm:justify-center">
          <div className="bg-gradient-to-b from-[#242424] to-[#0B0B0B] p-[1px] rounded-t-3xl sm:rounded-3xl sm:w-[560px]">
            <div className="w-full h-full px-4 py-6 sm:p-10 bg-[#0B0B0B] rounded-t-3xl sm:rounded-3xl">
              {children}
            </div>
          </div>
        </main>

        <Image
          className="object-cover -z-10"
          alt=""
          src="/illustrations/forest.png"
          fill
          aria-hidden
        />
      </body>
    </html>
  );
}
