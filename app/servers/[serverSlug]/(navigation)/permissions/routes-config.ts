import { Shield, Settings, TriangleAlert, Users, CreditCard, User, User2, Home } from "lucide-react";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import type { LucideIcon } from "lucide-react";
import type { IconProps } from "@radix-ui/react-icons/dist/types";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

// Types partagés
export type NavigationLink = {
  href: string;
  Icon: LucideIcon | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  label: string;
  permissions?: string[];
  roles?: AuthRole[];
};

export type NavigationGroup = {
  title: string;
  defaultOpenStartPath?: string;
  links: NavigationLink[];
};

// Configuration des chemins spéciaux
export type SpecialPathAccessRule = {
  segment: string;
  permissions: string[];
  logMessage: string;
};

export const SPECIAL_PATH_RULES: SpecialPathAccessRule[] = [
  {
    segment: 'citizens',
    permissions: ["EDIT_CITIZENS", "CREATE_CITIZENS"],
    logMessage: "Access denied to citizens section"
  },
  {
    segment: 'settings',
    permissions: ["EDIT_SERVER_SETTINGS"],
    logMessage: "Access denied to settings section"
  },
  {
    segment: 'users',
    permissions: ["MANAGE_USERS"],
    logMessage: "Access denied to users section"
  }
];

// Configuration des entités dynamiques
export type EntityPathRule = {
  segment: string;
  readPermission: string;
  entityName: string;
};

export const ENTITY_PATH_RULES: EntityPathRule[] = [
  {
    segment: 'citizens',
    readPermission: 'READ_CITIZEN',
    entityName: 'citizen',
  },
  {
    segment: 'guilds',
    readPermission: 'READ_GUILD',
    entityName: 'guild',
  },
  {
    segment: 'events',
    readPermission: 'READ_EVENT',
    entityName: 'event',
  },
];

// Configuration des liens de navigation
export const SERVER_PATH = `/servers/:serverSlug`;

export const SERVER_LINKS: NavigationGroup[] = [
  {
    title: "Menu",
    links: [
      {
        href: SERVER_PATH,
        Icon: Home,
        label: "Dashboard",
      },
      {
        href: `${SERVER_PATH}/citizens`,
        Icon: Users,
        label: "Citizens",
        permissions: ["EDIT_CITIZENS", "CREATE_CITIZENS"],
        roles: ["admin", "owner"],
      },
      {
        href: `${SERVER_PATH}/users`,
        Icon: User,
        label: "Users",
        permissions: ["MANAGE_USERS"],
      },
    ],
  },
  {
    title: "Server",
    defaultOpenStartPath: `${SERVER_PATH}/settings`,
    links: [
      {
        href: `${SERVER_PATH}/settings`,
        Icon: Settings,
        label: "Settings",
        roles: ["admin", "owner"],
        permissions: ["EDIT_SERVER_SETTINGS"],
      },
      {
        href: `${SERVER_PATH}/settings/members`,
        Icon: User2,
        label: "Members",
        roles: ["admin"],
      },
      {
        href: `${SERVER_PATH}/settings/roles`,
        Icon: Shield,
        label: "Roles",
        roles: ["admin"],
      },
      {
        href: `${SERVER_PATH}/settings/billing`,
        Icon: CreditCard,
        label: "Billing",
        roles: ["admin"],
      },
      {
        href: `${SERVER_PATH}/settings/danger`,
        Icon: TriangleAlert,
        label: "Danger Zone",
        roles: ["owner"],
      },
    ],
  },
];

// Fonction utilitaire pour remplacer le slug dans les chemins
export const replaceSlug = (href: string, slug: string): string => {
  return href.replace(":serverSlug", slug);
};

// Fonction utilitaire pour vérifier les rôles
export const isInRoles = (userRoles: AuthRole[] | undefined, requiredRoles: AuthRole[]): boolean => {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some(role => requiredRoles.includes(role));
}; 