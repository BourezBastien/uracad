import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { hasPermission } from "@/lib/auth/auth-org";
import { combineWithParentMetadata } from "@/lib/metadata";
import type { PageParams } from "@/types/next";
import { DonutChart } from "./donuts-chart";
import { UsersChart } from "./users-chart";
import { ClientServer } from "./client-org";

export const generateMetadata = combineWithParentMetadata({
  title: "Users",
  description: "Manage leads",
});

export default async function RoutePage(props: PageParams) {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Videos</LayoutTitle>
      </LayoutHeader>
      <LayoutActions className="flex gap-2">
        {(await hasPermission({ videos: ["delete"] })) && (
          <Button variant="outline">Delete</Button>
        )}
        {(await hasPermission({ videos: ["create"] })) && (
          <Button variant="default">Create</Button>
        )}
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <UsersChart />
          <ClientServer />
        </div>
        <DonutChart />
      </LayoutContent>
    </Layout>
  );
}
