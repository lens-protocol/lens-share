import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const tags = ["social"] as const;

const TagSchema = z.enum(tags);

export type Tag = z.infer<typeof TagSchema>;

const ProfileUrlSchema = z.string().url();

const PublicationUrlSchema = z.string().url();

const MappingSchema = z.object({
  profile: ProfileUrlSchema,
  publication: PublicationUrlSchema,
});

export const AppManifestSchema = z.object({
  shortname: z.string().min(3).max(10),
  name: z.string().min(3).max(36),
  description: z.string().min(50).max(140),
  icon: z.string().url(),
  image: z.string().url().optional(),
  tags: z
    .set(TagSchema)
    .max(tags.length)
    .catch(({ input }) => new Set(input)),
  mappings: z
    .union([
      z.object({
        mobile: MappingSchema,
      }),
      z.object({
        web: MappingSchema,
      }),
      z.object({
        mobile: MappingSchema,
        web: MappingSchema,
      }),
    ])
    .optional(),
});

export type AppManifest = z.infer<typeof AppManifestSchema>;

export const AppManifestJsonSchema = zodToJsonSchema(AppManifestSchema, {
  definitions: {
    MappingSchema,
    ProfileUrlSchema,
    PublicationUrlSchema,
    TagSchema,
  },
});
