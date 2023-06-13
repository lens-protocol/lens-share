import { NextResponse } from "next/server";

import { AppManifestJsonSchema } from "@/data";

export async function GET() {
  return NextResponse.json(AppManifestJsonSchema);
}
