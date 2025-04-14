import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { auth } from "../auth";
import type { AuthPermission, AuthRole } from "../auth/auth-permissions";
import { getSession } from "../auth/auth-user";
import { isInRoles } from "./is-in-roles";

type ServerParams = {
  roles?: AuthRole[];
  permissions?: AuthPermission;
};

export const getCurrentServer = async (params?: ServerParams) => {
  const user = await getSession();

  if (!user) {
    return null;
  }

  const server = await auth.api.getFullOrganization({
    headers: await headers(),
    query: {
      organizationId: user.session.activeOrganizationId ?? undefined,
    },
  });

  if (!server) {
    return null;
  }

  const memberRoles = server.members
    .filter((member) => member.userId === user.session.userId)
    .map((member) => member.role);

  if (memberRoles.length === 0 || !isInRoles(memberRoles, params?.roles)) {
    return null;
  }

  if (params?.permissions) {
    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permission: params.permissions,
      },
    });

    if (!hasPermission.success) {
      return null;
    }
  }

  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
    query: {
      referenceId: server.id,
    },
  });

  const currentSubscription = subscriptions.find(
    (s) =>
      s.referenceId === server.id &&
      (s.status === "active" || s.status === "trialing"),
  );

  return {
    ...server,
    user: user.user,
    email: (server.email ?? null) as string | null,
    memberRoles: memberRoles,
    subscription: currentSubscription ?? null,
  };
};

export type CurrentServerPayload = NonNullable<
  Awaited<ReturnType<typeof getCurrentServer>>
>;

export const getRequiredCurrentServer = async (params?: ServerParams) => {
  const result = await getCurrentServer(params);

  if (!result) {
    unauthorized();
  }

  return result;
};
