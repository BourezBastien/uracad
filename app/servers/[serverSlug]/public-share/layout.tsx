import { combineWithParentMetadata } from "@/lib/metadata";
import type { LayoutParams } from "@/types/next";
import PublicNavigation from "./_components/public-navigation";

export const generateMetadata = combineWithParentMetadata({
  title: "Public Share",
  description: "Public share of a fine.",
});

export default async function RouteLayout(
  props: LayoutParams<{ fineId: string; serverSlug: string }>,
) {

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <PublicNavigation>
        {props.children}
      </PublicNavigation>
    </div>
  );
}
