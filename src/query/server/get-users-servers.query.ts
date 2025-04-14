import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUsersServers() {
  const userServers = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return userServers;
}
