/* eslint-disable @next/next/no-img-element */
import { AppManifest } from "@/data";

export type AppRadioOptionProps = {
  app: AppManifest;
};

export function AppRadioOption({ app }: AppRadioOptionProps) {
  return (
    <label className="flex flex-row flex-grow items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg cursor-pointer">
      <input type="radio" name="appId" className="mr-2" value={app.appId} />
      <img className="w-8 h-8 mr-2" src={app.icon} alt={app.name} />
      <span className="text-gray-800 font-medium dark:text-white">{app.name}</span>
    </label>
  );
}
