import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import { getRequiredCurrentServerCache } from "@/lib/react/cache";
import { getUsersServers } from "@/query/server/get-users-servers.query";
import type { PropsWithChildren } from "react";
import { ServerSidebar } from "./server-sidebar"; 
import ServerBreadcrumb from "./server-breadcrumb";

export async function ServerNavigation({ children }: PropsWithChildren) {
  const server = await getRequiredCurrentServerCache();

  const userServers = await getUsersServers();

  return (
    <SidebarProvider>
      <ServerSidebar
        slug={server.slug}
        roles={server.memberRoles}
        userServers={userServers}
      />
      <SidebarInset className="border-accent border">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg" className="flex items-center gap-2">
            <SidebarTrigger
              size="lg"
              variant="outline"
              className="size-9 cursor-pointer"
            />
            <ServerBreadcrumb />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
