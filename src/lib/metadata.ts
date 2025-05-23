import type { PageParams } from "@/types/next";
import type { Metadata, ResolvingMetadata } from "next";
import { unstable_cache as cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Add a suffix to the title of the parent metadata
 *
 * If a layout in /users/ define the title as "Users", the title will be append to the title as "Users · My suffix"
 *
 * @param suffix The suffix to append to the title
 * @returns
 */
export const combineWithParentMetadata =
  (metadata: Metadata) =>
  async (_: PageParams, parent: ResolvingMetadata): Promise<Metadata> => {
    const parentMetadata = await parent;
    return {
      ...metadata,
      title: `${parentMetadata.title?.absolute} · ${metadata.title}`,
    };
  };

/**
 * This method help us to cache the metadata to avoid to call the database every time.
 *
 * The cache is revalidate every 100 seconds.
 */
export const serverMetadata = cache(
  async (serverSlug: string): Promise<Metadata> => {
    const server = await prisma.organization.findFirst({
      where: {
        slug: serverSlug,
      },
    });

    if (!server) {
      return {
        title: "Server not found",
      };
    }

    return {
      title: `${server.name}`,
      description: "Your server dashboard",
    };
  },
  ["server-metadata"],
  { revalidate: 100 },
);
