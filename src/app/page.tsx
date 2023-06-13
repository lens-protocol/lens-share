import { headers } from "next/headers";
import { userAgent } from "next/server";

import { manifests } from "@/data";

function isMobileUa(type: string) {
  return ["mobile", "tablet"].includes(type);
}

export default async function Home() {
  const ua = userAgent({ headers: headers() });

  return (
    <main>
      <pre>{ua.device.type}</pre>
    </main>
  );
}
