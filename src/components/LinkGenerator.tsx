"use client";

import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { experimental_useOptimistic } from "react";

/* eslint-disable @next/next/no-img-element */

export function LinkGenerator({}) {
  const [optimisticValue, addOptimisticValue] = experimental_useOptimistic("");

  const onChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    addOptimisticValue(e.target.value);
  };

  return (
    <div className="flex flex-col justify-between items-center gap-8 sm:gap-10">
      <div className="w-full text-left">
        <p className="header-six !font-bold text-lightForest">Create a Lens Share link</p>
      </div>

      <div className="flex flex-col w-full items-start gap-2 font-gintoNord font-medium text-[16px]">
        <p className="text-lightForest">Original link</p>

        <label className="w-full relative h-[58px]">
          <input
            className="absolute top-0 left-0 w-full bg-white/10 h-[58px] rounded-xl text-white placeholder:text-white/60 pl-4 pr-8"
            placeholder="Add a post/profile link from any Lens app..."
            value={optimisticValue}
            onChange={onChangeLink}
          />

          {/* // Verify that the link is correct and a Lens link */}
          {optimisticValue ? (
            <CheckIcon className="text-lightForest h-6 w-6 absolute right-4 top-4" />
          ) : null}
        </label>
      </div>

      {/* // Verify that the link is correct and a Lens link */}
      {optimisticValue ? (
        <div className="flex flex-col w-full items-start gap-2 font-gintoNord font-medium text-[16px]">
          <p className="text-lightForest">Copy and share your universal Lens Share link</p>

          <button className="w-full flex items-center justify-between h-[58px] bg-white/10  rounded-xl px-4 hover:bg-white/20 hover:outline outline-lightForest">
            <p className="text-white">{"https://localhost:3000"}</p>

            <ClipboardDocumentIcon className="text-lightForest h-6 w-6" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
