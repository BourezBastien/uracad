import type {
  NavigationGroup,
  NavigationLink,
} from "@/features/navigation/navigation.type";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { isInRoles } from "@/lib/servers/is-in-roles";
import {
  CreditCard,
  Home,
  Settings,
  TriangleAlert,
  User,
  User2,
  Shield,
} from "lucide-react";

const replaceSlug = (href: string, slug: string) => {
  return href.replace(":serverSlug", slug);
};

export const getServerNavigation = (
  slug: string,
  userRoles: AuthRole[] | undefined,
): NavigationGroup[] => {
  return SERVER_LINKS.map((group: NavigationGroup) => {
    return {
      ...group,
      defaultOpenStartPath: group.defaultOpenStartPath
        ? replaceSlug(group.defaultOpenStartPath, slug)
        : undefined,
      links: group.links
        .filter((link: NavigationLink) =>
          link.roles ? isInRoles(userRoles, link.roles) : true,
        )
        .map((link: NavigationLink) => {
          return {
            ...link,
            href: replaceSlug(link.href, slug),
          };
        }),
    };
  });
};

const SERVER_PATH = `/servers/:serverSlug`;

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
        href: `${SERVER_PATH}/users`,
        Icon: User,
        label: "Users",
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
        label: "Billing",
        roles: ["admin"],
        Icon: CreditCard,
      },
      {
        href: `${SERVER_PATH}/settings/danger`,
        label: "Danger Zone",
        roles: ["owner"],
        Icon: TriangleAlert,
      },
    ],
  },
] satisfies NavigationGroup[];
