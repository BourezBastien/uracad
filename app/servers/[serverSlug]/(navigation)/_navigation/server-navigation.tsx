"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { ServerSidebar } from "./server-sidebar"; 
import ServerBreadcrumb from "./server-breadcrumb";
import { PermissionsProvider } from "../permissions/permissions-provider";

// Define valid role types
type AuthRole = "member" | "admin" | "owner";

// Simplified Organization type
type ServerOrganization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date;
  metadata?: Record<string, unknown>; 
};

// Custom type that extends Organization with required properties
type ServerWithRoles = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  memberRoles: AuthRole[];
};

// Props to receive data from server component
type ServerNavigationProps = PropsWithChildren & {
  server: ServerWithRoles;
  userServers: ServerOrganization[];
  userPermissions: string[];
};

// Client component that receives data as props
export function ServerNavigation({ 
  children, 
  server, 
  userServers, 
  userPermissions 
}: ServerNavigationProps) {
  return (
    <PermissionsProvider 
      permissions={userPermissions}
      roles={server.memberRoles}
    >
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
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PermissionsProvider>
  );
}
