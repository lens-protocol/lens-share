"use client";

import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { ToastBar, Toaster } from "react-hot-toast";

/* eslint-disable @next/next/no-img-element */
type AppWrapperProps = {
  children: React.ReactNode;
};

const toastOptions = {
  error: {
    style: {
      background: "#F5D4D2",
      color: "black",
      borderRadius: "16px",
    },
    className: "shadow-xl",
  },
  success: {
    style: {
      background: "#C3E4CD",
      text: "black",
      borderRadius: "16px",
    },
    className: "shadow-xl",
  },
};

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();

  return (
    <>
      <Toaster position="bottom-right" toastOptions={toastOptions}>
        {(t) => (
          <ToastBar toast={t}>
            {({ message }) => (
              <span className="flex !font-sans">
                {t.type === "error" ? (
                  <ExclamationCircleIcon className="w-6" color="#5A4E4C" />
                ) : (
                  <CheckIcon className="w-5" color="#3D4B41" />
                )}
                {message}
              </span>
            )}
          </ToastBar>
        )}
      </Toaster>

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
    </>
  );
}
