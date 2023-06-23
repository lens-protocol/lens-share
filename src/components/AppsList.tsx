/* eslint-disable @next/next/no-img-element */
import { assertNonEmptyArray } from "@lens-protocol/shared-kernel";

import { AppManifest } from "@/data";

type AppsListProps = {
  attribution: AppManifest | null;
  options: readonly AppManifest[];
};

export function AppsList({ attribution, options }: AppsListProps) {
  assertNonEmptyArray(options);

  const cannotUseOriginatingApp = attribution && attribution?.appId !== options[0].appId;

  return (
    <div className="flex flex-col justify-between items-center gap-8 sm:gap-10">
      <div>
        {cannotUseOriginatingApp && (
          <p className="text-gray-500 text-sm text-center" data-testid="context">
            Shared via{" "}
            <a
              className="font-bold hover:underline"
              href={attribution.routes.home}
              rel="nofollow"
              target="_blank"
            >
              {attribution.name}
            </a>{" "}
            mobile app.
          </p>
        )}

        <p className="text-xl font-bold text-white text-center">Open with Lens app…</p>
      </div>

      <ol className="flex flex-row flex-wrap justify-around gap-4">
        {options.map((app) => (
          <li key={app.appId} className="flex flex-col items-center justify-between gap-2">
            <button
              type="submit"
              name="appId"
              value={app.appId}
              className="flex justify-center items-center border-[1px] border-[#ffffff33] rounded-2xl w-20 h-20 p-2 overflow-hidden"
              style={{ backgroundColor: app.icon.background }}
            >
              <img
                className="w-full h-full"
                src={app.icon.url}
                alt={app.name}
                width={56}
                height={56}
              />
            </button>
            <span className="font-sans text-sm">{app.name}</span>
          </li>
        ))}
      </ol>

      <label className="flex items-center text-base text-gray">
        <input
          name="remember"
          type="checkbox"
          value="true"
          className="w-5 h-5 mr-2 accent-slate-100 bg-gray-600 checked:bg-gray-600 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
        />
        Remember for 2 weeks
      </label>
    </div>
  );
}
