import { RefreshPage } from "@/components/utils/refresh-page";
import { auth } from "@/lib/auth";
import { serverMetadata } from "@/lib/metadata";
import { getCurrentServer } from "@/lib/servers/get-server";
import type { LayoutParams, PageParams } from "@/types/next";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { InjectCurrentServerStore } from "./use-current-server";

export async function generateMetadata(
  props: PageParams<{ serverSlug: string }>,
): Promise<Metadata> {
  const params = await props.params;
  return serverMetadata(params.serverSlug);
}

export default async function RouteLayout(
  props: LayoutParams<{ serverSlug: string }>,
) {
  const params = await props.params;

  const server = await getCurrentServer();

  // The user try to go to another server, we must sync with the URL
  if (server?.slug !== params.serverSlug) {
    // Note: Still using setActiveOrganization API method since the API hasn't been renamed
    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationSlug: params.serverSlug,
      },
    });
    // Make a full refresh of the page
    return <RefreshPage />;
  }

  return (
    <InjectCurrentServerStore
      server={{
        id: server.id,
        slug: server.slug,
        name: server.name,
        image: server.logo ?? null,
        subscription: server.subscription,
      }}
    >
      {props.children}
    </InjectCurrentServerStore>
  );
}
