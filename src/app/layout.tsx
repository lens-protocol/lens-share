import "./globals.css";

import { ginto, gintoNord } from "./fonts";

export const metadata = {
  title: "Lens Share",
  description: "Share and Explore Lens links Effortlessly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ginto.variable} ${gintoNord.variable}`}>
      <body>{children}</body>
    </html>
  );
}
