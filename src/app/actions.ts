"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function openWith(data: FormData) {
  const url = data.get("url") as string;

  redirect(url);
}
