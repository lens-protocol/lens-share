import { AppManifest } from "@/data";

export type AppRadioOptionProps = {
  app: AppManifest;
  url: string;
};

export function AppRadioOption({ app, url }: AppRadioOptionProps) {
  return (
    <label className="flex flex-row flex-grow items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg cursor-pointer">
      <input type="radio" name="url" className="mr-2" value={url} />
      <img className="w-8 h-8 mr-2" src={app.icon} alt={app.name} />
      <span className="text-gray-800 font-medium dark:text-white">{app.name}</span>
    </label>
  );
}
