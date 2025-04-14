import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/auth-user";
import { getUsersServers } from "@/query/server/get-users-servers.query";
import type { PropsWithChildren } from "react";

import { UserDropdown } from "../auth/user-dropdown";
import { NavigationWrapper } from "./navigation-wrapper";
import { ServersSelect } from "../../../app/servers/[serverSlug]/(navigation)/_navigation/server-select";

// TODO : Update this
export default async function AuthNavigationWrapper(props: PropsWithChildren) {
  const user = await getUser();

  if (!user) {
    return <NavigationWrapper>{props.children}</NavigationWrapper>;
  }

  const userServers = await getUsersServers();

  return (
    <NavigationWrapper
      logoChildren={
        <ServersSelect servers={userServers} currentserverSlug="new">
          <span>Server...</span>
        </ServersSelect>
      }
      topBarCornerLeftChildren={
        <UserDropdown>
          <Button variant="ghost" className="size-10 rounded-full" size="sm">
            <Avatar className="size-8">
              <AvatarFallback>
                {user.email ? user.email.slice(0, 2) : "??"}
              </AvatarFallback>
              {user.image && <AvatarImage src={user.image} />}
            </Avatar>
          </Button>
        </UserDropdown>
      }
    >
      {props.children}
    </NavigationWrapper>
  );
}
