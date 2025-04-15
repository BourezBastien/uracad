import { hasUserPermission } from "./permissions/permissions.action";
import { PermissionMiddleware } from "./permission-middleware";
import type { PropsWithChildren } from "react";

type PermissionWrapperProps = PropsWithChildren & {
  serverSlug: string;
};

export async function PermissionWrapper({ 
  children,
  serverSlug,
}: PermissionWrapperProps) {
  // Vérifier si l'utilisateur est admin ou owner (bypass)
  const isPowerUser = await hasUserPermission(["admin", "owner"], "OR");

  return (
    <PermissionMiddleware 
      serverSlug={serverSlug} 
      isPowerUser={isPowerUser}
    >
      {children}
    </PermissionMiddleware>
  );
} 