import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import { getUsersServers } from "@/query/server/get-users-servers.query";
import type { PropsWithChildren } from "react";
import { AccountSidebar } from "./account-sidebar";

export async function AccountNavigation({ children }: PropsWithChildren) {
  const userServers = await getUsersServers();

  return (
    <SidebarProvider>
      <AccountSidebar userServers={userServers} />
      <SidebarInset className="border-accent border">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg">
            <SidebarTrigger className="-ml-1" />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
