import { PlatformType, RouteKind } from "@/app/types";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const tags = ["audio", "image", "text", "video"] as const;

const TagSchema = z.enum(tags);

export type Tag = z.infer<typeof TagSchema>;

const ProfileUrlSchema = z.string().url().includes(":handle");

const PublicationUrlSchema = z.string().url().includes(":id");

const RoutesSchema = z
  .object({
    [RouteKind.Profile]: ProfileUrlSchema,
    [RouteKind.Publication]: PublicationUrlSchema,
  })
  .partial();

const MappingsSchema = z
  .object({
    [PlatformType.Web]: RoutesSchema,
    [PlatformType.Mobile]: RoutesSchema,
  })
  .partial();

export const AppManifestSchema = z.object({
  shortname: z.string().min(3).max(16),
  name: z.string().min(3).max(36),
  description: z.string().min(20).max(200),
  icon: z.string().url(),
  image: z.string().url().optional(),
  tags: z
    .set(TagSchema)
    .max(tags.length)
    .catch(({ input }) => new Set(input)),
  mappings: MappingsSchema,
});

export type AppManifest = z.infer<typeof AppManifestSchema>;

export const AppManifestJsonSchema = zodToJsonSchema(AppManifestSchema, {
  definitions: {
    ProfileUrlSchema,
    PublicationUrlSchema,
    RoutesSchema,
    TagSchema,
  },
});
