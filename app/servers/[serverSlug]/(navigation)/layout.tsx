import type { LayoutParams } from "@/types/next";
import { ServerNavigation } from "./_navigation/server-navigation";


export default async function RouteLayout(
  props: LayoutParams<{ serverSlug: string }>,
) {
  return <ServerNavigation>{props.children}</ServerNavigation>;
}
