"use client";

import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Spinner from "./Spinner";
import { AppId } from "@/app/types";

/* eslint-disable @next/next/no-img-element */

const isValidURL = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://");
};

type LinkData = {
  linkType: { type: "profile" | "publication" | "unknown"; url?: string; by?: AppId };
};

export function LinkGenerator({}) {
  const [link, setLink] = useState("");
  const [newLink, setNewLink] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLinkGood, setIsLinkGood] = useState<boolean>(false);

  const generateLink = async (link: string) => {
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
        setIsLinkGood(false);

        return;
      } else {
        setIsLinkGood(true);
        setNewLink(
          data.linkType.url + (data.linkType.by ? "?by=" + data.linkType.by : "") ?? undefined
        );
      }
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedGenerateLink = debounce(generateLink, 2400);

  const onChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);

    if (e.target.value.length > 20 && isValidURL(e.target.value)) {
      setIsLoading(true);
      debouncedGenerateLink(e.target.value);
    } else {
      setNewLink("");
    }
  };

  const onPasteLink = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedContent = e.clipboardData.getData("text");

    setLink(pastedContent);
    setIsLoading(true);
    debouncedGenerateLink(pastedContent);
  };

  useEffect(() => {
    if (link.length < 20 || !isValidURL(link)) {
      setNewLink("");
    }
  }, [link]);

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
            onPaste={onPasteLink}
          />

          {isLinkGood && newLink && link.length > 20 ? (
            <CheckIcon className="text-lightForest h-6 w-6 absolute right-4 top-4" />
          ) : null}

          {isLoading ? (
            <div className="absolute right-4 top-5">
              <Spinner />
            </div>
          ) : null}
        </label>
      </div>

      {isLinkGood && newLink && link.length > 20 ? (
        <div className="flex flex-col w-full items-start gap-2 font-gintoNord font-medium text-[16px]">
          <p className="text-lightForest">Copy and share your universal Lens Share link</p>

          <button
            onClick={() => {
              toast.success("Copied to clipboard");
              navigator.clipboard.writeText(newLink);
            }}
            className="w-full flex items-center justify-between h-[58px] bg-white/10  rounded-xl px-4 hover:bg-white/20 hover:outline outline-lightForest"
          >
            <span className="flex items-center justify-start">
              <p className="text-white">{newLink.split("?by")[0]}</p>
              <p className="text-white/40">?by{newLink.split("?by")[1]}</p>
            </span>

            <ClipboardDocumentIcon className="text-lightForest h-6 w-6" />
          </button>
        </div>
      ) : null}

      {!isLinkGood && link.length > 20 ? (
        <div className="w-full">
          <p className="text-lg">We are sorry we couldn't build a Lens Share Link at this time.</p>

          <p className="opacity-90 mt-2">
            You can however build it manually adopting one of these patterns:
          </p>

          <p className="opacity-80 mt-2">https://share.lens.xyz/u/</p>
          <p className="opacity-80">https://share.lens.xyz/p/</p>
        </div>
      ) : null}
    </div>
  );
}
