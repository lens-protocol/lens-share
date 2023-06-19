import localFont from "next/font/local";

export const ginto = localFont({
  src: [
    {
      path: "./Ginto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Ginto-Medium.woff",
      weight: "500",
      style: "medium",
    },
    {
      path: "./Ginto-Bold.woff",
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
      path: "./GintoNord-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./GintoNord-Medium.woff",
      weight: "500",
      style: "medium",
    },
    {
      path: "./GintoNord-Bold.woff",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-ginto-nord",
  fallback: ["sans-serif"],
  preload: true,
  display: "swap",
});
