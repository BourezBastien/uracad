import { getPlanLimits } from "@/lib/auth/auth-plans";
import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getRequiredCurrentServerCache } from "@/lib/react/cache";
import { getServersMembers } from "@/query/server/get-servers-members";
import type { PageParams } from "@/types/next";
import { ServerMembersForm } from "./server-members-form";

export const generateMetadata = combineWithParentMetadata({
  title: "Members",
  description: "Manage your server members.",
});

export default async function RoutePage(props: PageParams) {
  const server = await getRequiredCurrentServerCache({
    permissions: {
      member: ["create", "update", "delete"],
    },
  });

  const members = await getServersMembers(server.id);

  const maxMembers = getPlanLimits(server.subscription?.plan).members;

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: server.id,
    },
  });

  return (
    <ServerMembersForm
      invitations={invitations}
      members={members}
      maxMembers={maxMembers}
    />
  );
}
