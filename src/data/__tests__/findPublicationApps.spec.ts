import { PlatformType } from "@/app/types";

import { findPublicationApps } from "../findPublicationApps";

describe(`Given the ${findPublicationApps.name} function`, () => {
  describe(`when invoked with platform=${PlatformType.Web}`, () => {
    it(`should return a list of web-only apps that:
        - capable of presenting publications`, async () => {
      const list = await findPublicationApps({ platform: PlatformType.Web });

      expect(list.map((app) => app.appId)).toEqual(["lenster", "lenstube", "memester"]);
    });
  });

  describe(`when invoked with platform=${PlatformType.Mobile}`, () => {
    it(`should return a list of mobile and web apps that:
        - capable of presenting publications`, async () => {
      const list = await findPublicationApps({ platform: PlatformType.Mobile });

      expect(list.map((app) => app.appId)).toEqual(["lenster", "lenstube", "memester"]);
    });
  });

  describe(`when invoked with "exclude" option`, () => {
    it(`should return a list apps that without the specified app`, async () => {
      const list = await findPublicationApps({
        platform: PlatformType.Mobile,
        exclude: "lenster",
      });

      expect(list.map((app) => app.appId)).toEqual(["lenstube", "memester"]);
    });
  });
});
