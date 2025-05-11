"use server";

import { ActionError, serverAction } from "@/lib/actions/safe-actions";
import { hasPermission } from "@/lib/auth/auth-org";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";

export const openStripePortalAction = serverAction.action(async ({ ctx: org }) => {
  const stripeCustomerId = org.subscription?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new ActionError("No stripe customer id found");
  }

  if (!(await hasPermission({ subscription: ["manage"] }))) {
    throw new ActionError("You do not have permission to manage subscriptions");
  }

  const stripeBilling = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getServerUrl()}/servers/${org.slug}/settings/billing`,
  });

  if (!stripeBilling.url) {
    throw new ActionError("Failed to create stripe billing portal session");
  }

  return {
    url: stripeBilling.url,
  };
});
