import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { CancelSubscriptionForm } from "./cancel-form";
import { getRequiredCurrentServerCache } from "@/lib/react/cache";

export default async function CancelSubscriptionPage() {
  const server = await getRequiredCurrentServerCache();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Cancel Subscription</LayoutTitle>
        <LayoutDescription>
          We're sorry to see you go. Please let us know why you're cancelling so
          we can improve our service.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <CancelSubscriptionForm orgId={server.id} serverSlug={server.slug} />
      </LayoutContent>
    </Layout>
  );
}
