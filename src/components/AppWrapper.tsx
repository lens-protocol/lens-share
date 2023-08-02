"use client";

import { clsx } from "clsx";
import { usePathname } from "next/navigation";

/* eslint-disable @next/next/no-img-element */
type AppWrapperProps = {
  children: React.ReactNode;
};

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "bg-[#0F1110]/60 p-[1px] rounded-t-3xl sm:rounded-3xl backdrop-blur-sm",
        pathname === "/" ? "sm:w-[760px]" : "sm:w-[560px]"
      )}
    >
      <div className="w-full h-full px-4 py-6 sm:p-10 bg-[#0F1110]/60 rounded-t-3xl sm:rounded-3xl">
        {children}
      </div>
    </div>
  );
}
