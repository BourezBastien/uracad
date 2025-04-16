import type { PageParams } from "@/types/next";
import { 
  Layout, 
  LayoutContent, 
  LayoutDescription, 
  LayoutHeader, 
  LayoutTitle,
  LayoutActions
} from "@/features/page/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCitizensList } from "./citizens.action";
import { CitizensTable } from "./citizens-table";
import Link from "next/link";
import { getRequiredCurrentServerCache } from "@/lib/react/cache";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { combineWithParentMetadata } from "@/lib/metadata";

// Ajouter des métadonnées à la page
export const generateMetadata = combineWithParentMetadata({
  title: "Citizens",
  description: "Manage citizens database for your CAD/MDT system",
});

// Create searchParams cache for pagination
const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10)
});

export default async function CitizensPage({ searchParams }: PageParams) {
  // Parse search params
  const { page, limit } = await searchParamsCache.parse(searchParams);
  const server = await getRequiredCurrentServerCache();
  
  // Get citizens with pagination
  const { citizens, pagination } = await getCitizensList(page, limit);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Citizens</LayoutTitle>
        <LayoutDescription>
          Manage citizens database for your CAD/MDT system
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>
        <Button asChild>
          <Link href={`/servers/${server.slug}/citizens/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Citizen
          </Link>
        </Button>
      </LayoutActions>
      <LayoutContent>
        <CitizensTable 
          citizens={citizens} 
          serverSlug={server.slug} 
          pagination={pagination}
        />
      </LayoutContent>
    </Layout>
  );
}
