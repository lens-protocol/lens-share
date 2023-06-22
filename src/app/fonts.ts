import fs from "fs";
import path from "path";

import localFont from "next/font/local";

export const ginto = localFont({
  src: [
    {
      path: "../../public/fonts/Ginto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Ginto-Medium.woff",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/Ginto-Bold.woff",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-ginto",
  fallback: ["sans-serif"],
  preload: true,
  display: "swap",
});

export const gintoNord = localFont({
  src: [
    {
      path: "../../public/fonts/GintoNord-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GintoNord-Medium.woff",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/GintoNord-Bold.woff",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-ginto-nord",
  fallback: ["sans-serif"],
  preload: true,
  display: "swap",
});

export const gintoNordMediumData = fs.readFileSync(
  path.resolve(process.cwd(), "public/fonts/GintoNord-Medium.woff")
);
