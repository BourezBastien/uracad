import type { PageParams } from "@/types/next";
import { 
  Layout, 
  LayoutContent, 
  LayoutDescription, 
  LayoutHeader, 
  LayoutTitle,
  LayoutActions,
} from "@/features/page/layout";
import { CitizenProfile } from "../citizen-profile";
import { getCitizen } from "../citizens.action";
import { notFound } from "next/navigation";
import { getRequiredCurrentServerCache } from "@/lib/react/cache";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export default async function CitizenDetailPage(props: PageParams<{ citizenId: string }>) {
  const server = await getRequiredCurrentServerCache();
  const params = await props.params;
  
  const citizen = await getCitizen(params.citizenId);
  
  if (!citizen) {
    notFound();
  }

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>{citizen.name} {citizen.surname}</LayoutTitle>
        <LayoutDescription>
          Citizen profile
        </LayoutDescription>
      </LayoutHeader>
      
      <LayoutActions>
        <Button asChild variant="outline">
          <Link href={`/servers/${server.slug}/citizens/${citizen.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
              Edit Citizen
            </Link>
          </Button>
      </LayoutActions>
      
      <LayoutContent className="px-0">
        <CitizenProfile citizen={citizen} serverSlug={server.slug} />
      </LayoutContent>
    </Layout>
  );
} 