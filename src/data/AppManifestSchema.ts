import { PublicationMainFocus } from "@lens-protocol/client";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { AppId, PlatformType, RouteKind } from "@/app/types";

const AppIdSchema: z.Schema<AppId, z.ZodTypeDef, string> = z
  .string({
    description:
      "A unique project identifier. " +
      "If your project includes 2+ apps (e.g. web and mobile), define a manifest for each app and use the same `appId` for all of them. " +
      "If you are specifying an `appId` as part of your Publication Metadata, it must match this value.",
  })
  .min(3)
  .max(16)
  .regex(/^[a-z][a-z0-9]+$/i)
  .transform((value) => value as AppId);

const ProfileUrlSchema = z.object(
  {
    url: z
      .string({
        description:
          "The `:handle` placeholder will be replaced with the full profile handle inclusive of `.lens` suffix when relevant (e.g. `lensapi.lens`, `lensprotocol`).",
      })
      .url()
      .includes(":handle"),
  },
  {
    description: "The app specific profile route details.",
  }
);

const PublicationMainFocusSchema = z.nativeEnum(PublicationMainFocus, {
  description: "Publication main focus. Matches Publication Metadata spec.",
});

const PublicationUrlSchema = z.object(
  {
    url: z
      .string({
        description:
          "The `:id` placeholder will be replaced with Publication ID (e.g. `0x01-01`, `0x01-42-DA-ababab`).",
      })
      .url()
      .includes(":id"),
    supports: z.array(PublicationMainFocusSchema, {
      description:
        "A list of supported publication main focuses. " +
        "If a given publication main focus is present in this list, the app will be shown in the options to open the publication with.",
    }),
  },
  {
    description: "The app specific publication route details.",
  }
);

const PlatformTypeSchema = z.nativeEnum(PlatformType, {
  description: "The supported platform.",
});

const RoutesSchema = z.object({
  [RouteKind.Home]: z
    .string({
      description:
        "The project home page. It will be used as attribution fallback in case the a link shared with this app cannot be opened by the user's device (e.g. link generated from a mobile-only app but opened with a desktop browser).",
    })
    .url(),
  [RouteKind.Profile]: ProfileUrlSchema.optional(),
  [RouteKind.Publication]: PublicationUrlSchema.optional(),
});

export const AppManifestSchema = z.object({
  appId: AppIdSchema,
  name: z.string({ description: "A human readable name for the app/project." }).min(3).max(36),
  description: z
    .string({ description: "A brief description of the app/project." })
    .min(20)
    .max(200),
  platform: PlatformTypeSchema,
  icon: z.string().url(),
  routes: RoutesSchema,
});

export type AppManifest = z.infer<typeof AppManifestSchema>;

export const AppManifestJsonSchema = zodToJsonSchema(AppManifestSchema);
