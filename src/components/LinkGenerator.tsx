"use client";

import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "react-hot-toast";

import Spinner from "./Spinner";

/* eslint-disable @next/next/no-img-element */
type LinkData = { linkType: { type: "profile" | "publication" | "unknown"; url?: string } };

export function LinkGenerator({}) {
  const [link, setLink] = useState("");
  const [newLink, setNewLink] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const generateLink = async () => {
    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate link");
      }

      const data: LinkData = await response.json();

      if (data.linkType.type === "unknown") {
        toast.error("Link not supported");
        return;
      }

      setNewLink(data.linkType.url ?? undefined);
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setIsLoading(false);
    }
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
            value={link}
            onChange={onChangeLink}
          />

          {newLink ? (
            <CheckIcon className="text-lightForest h-6 w-6 absolute right-4 top-4" />
          ) : null}

          {isLoading ? (
            <div className="absolute right-4 top-5">
              <Spinner />
            </div>
          ) : null}
        </label>
      </div>

      {newLink ? (
        <div className="flex flex-col w-full items-start gap-2 font-gintoNord font-medium text-[16px]">
          <p className="text-lightForest">Copy and share your universal Lens Share link</p>

          <button
            onClick={() => {
              toast.success("Copied to clipboard");
              navigator.clipboard.writeText(newLink);
            }}
            className="w-full flex items-center justify-between h-[58px] bg-white/10  rounded-xl px-4 hover:bg-white/20 hover:outline outline-lightForest"
          >
            <p className="text-white">{newLink}</p>

            <ClipboardDocumentIcon className="text-lightForest h-6 w-6" />
          </button>
        </div>
      ) : null}

      <button
        onClick={generateLink}
        className="bg-lightForest text-darkForest font-gintoNord w-full p-3 rounded-xl font-medium uppercase hover:opacity-95"
      >
        Generate link
      </button>
    </div>
  );
}
