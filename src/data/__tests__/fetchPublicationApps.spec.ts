import { PlatformType } from "@/app/types";
import { AppManifest } from "../AppManifestSchema";
import { fetchPublicationApps } from "../fetchPublicationApps";

describe(`Given the ${fetchPublicationApps.name}`, () => {
  describe(`when invoked with platform=${PlatformType.Web}`, () => {
    it("should return the list of apps capable of presenting the publication", async () => {
      const list = await fetchPublicationApps({ platform: PlatformType.Web });

      expect(list.map((app) => app.shortname)).toEqual(["Lenster", "Lenstube", "Memester"]);
    });
  });
});
