'use client';

import type { PropsWithChildren } from "react";
import { Error401 } from "@/features/page/error-401";
import { Layout } from "@/features/page/layout";
import { logger } from "@/lib/logger";
import { SERVER_LINKS } from "./permissions/routes-config";
import { useSelectedLayoutSegments } from "next/navigation";
type PermissionMiddlewareProps = PropsWithChildren & {
  serverSlug: string;
  isPowerUser: boolean;
};

// Composant client qui récupère le pathname
export function PermissionMiddleware({ 
  children,
  serverSlug,
  isPowerUser,
}: PermissionMiddlewareProps) {
  const segments = useSelectedLayoutSegments();
  const pathname = segments.length > 0 ? `/${segments.join('/')}` : '/';

  logger.info("Permission check started", {
    serverSlug,
    pathname,
    isPowerUser,
  });

  // Si l'utilisateur est admin ou owner, on autorise tout
  if (isPowerUser) {
    logger.info("User is admin or owner, granting full access");
    return <>{children}</>;
  }

  // Trouver les permissions requises pour le chemin actuel
  const requiredAccess = findRequiredPermissions(pathname, serverSlug);
  
  // Si aucune permission n'est requise pour ce chemin, on refuse l'accès par défaut
  if (!requiredAccess) {
    logger.info("No route configuration found, denying access");
    return (
      <Layout>
        <Error401 title="Unauthorized Access" />
      </Layout>
    );
  }

  // Si la route est trouvée mais n'a pas de restrictions, on autorise
  if (!requiredAccess.permissions?.length && !requiredAccess.roles?.length) {
    logger.info("Route found with no restrictions, granting access");
    return <>{children}</>;
  }

  return (
    <Layout>
      <Error401 title="Unauthorized Access" />
    </Layout>
  );
}

function findRequiredPermissions(path: string, serverSlug: string) {
  logger.info("Finding permissions for path:", { path });
  
  // Chercher dans SERVER_LINKS
  for (const group of SERVER_LINKS) {
    for (const link of group.links) {
      // Nettoyer le chemin du lien pour la comparaison
      const linkPath = link.href
        .replace(':serverSlug', serverSlug)
        .replace(/^\/servers\/[^/]+/, '')
        .replace(/\/$/, ''); // Enlever le slash final s'il existe
        
      const cleanPath = path.replace(/\/$/, ''); // Enlever le slash final s'il existe
      
      // Vérifier la correspondance exacte ou si c'est un sous-chemin
      if (cleanPath === linkPath || (linkPath && cleanPath.startsWith(`${linkPath}/`))) {
        return {
          permissions: link.permissions,
          roles: link.roles
        };
      }
    }
  }
  
  logger.info("No matching route found");
  return null;
} 