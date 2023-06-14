import { PlatformType } from "@/app/types";
import { fetchPublicationApps } from "../fetchPublicationApps";

describe(`Given the ${fetchPublicationApps.name} function`, () => {
  describe(`when invoked with platform=${PlatformType.Web}`, () => {
    it(`should return a list of web-only apps that:
        - capable of presenting publications`, async () => {
      const list = await fetchPublicationApps({ platform: PlatformType.Web });

      expect(list.map((app) => app.appId)).toEqual(["lenster", "lenstube", "memester"]);
    });
  });

  describe(`when invoked with platform=${PlatformType.Mobile}`, () => {
    it(`should return a list of mobile and web apps that:
        - capable of presenting publications`, async () => {
      const list = await fetchPublicationApps({ platform: PlatformType.Mobile });

      expect(list.map((app) => app.appId)).toEqual(["orb", "lenster", "lenstube", "memester"]);
    });
  });
});
