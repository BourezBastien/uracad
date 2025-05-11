"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingButton } from "@/features/form/submit-button";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { LIMITS_CONFIG } from "@/lib/auth/auth-plans";
import type { CurrentServerPayload } from "@/lib/servers/get-server";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";
import {
  AlertCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { openStripePortalAction } from "./billing.action";

export function ServerBilling(props: {
  subscription: CurrentServerPayload["subscription"];
  serverId: string;
  serverSlug: string;
}) {
  const subscription = props.subscription;
  const router = useRouter();

  const manageSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const stripeCustomerId = subscription?.stripeCustomerId;

      if (!stripeCustomerId) {
        throw new Error("No stripe customer id found");
      }

      const stripeBilling = await resolveActionResult(openStripePortalAction()) as { url: string };

      router.push(stripeBilling.url);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!subscription) {
    return <p>Error</p>;
  }

  const statusConfig =
    STATUS_CONFIG[subscription.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;

  // Calculate days remaining in trial if applicable
  const daysRemaining =
    subscription.status === "trialing"
      ? differenceInDays(
          new Date(subscription.periodEnd ?? new Date()),
          new Date(),
        )
      : 0;

  const trialProgress =
    subscription.status === "trialing" ? 100 - (daysRemaining / 14) * 100 : 0;

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Details about your current subscription
              </CardDescription>
            </div>
            <Badge
              className={cn("px-3 py-1", statusConfig.color, "text-white")}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Information */}
          <Card className="bg-accent/50 flex px-6 py-4">
            <div className="flex items-center gap-2">
              <StatusIcon
                className={cn("mt-0.5 mr-3 h-5 w-5", statusConfig.textColor)}
              />
              <h3 className="font-medium">{statusConfig.description}</h3>
            </div>
            <div className="empty:hidden">
              {subscription.status === "trialing" && (
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Trial period: {daysRemaining} days remaining</span>
                  </div>
                  <Progress value={trialProgress} className="h-2" />
                </div>
              )}
              {subscription.cancelAtPeriodEnd && (
                <p className="text-muted-foreground mt-0 text-sm">
                  Your subscription will end on{" "}
                  {format(
                    new Date(subscription.periodEnd ?? new Date()),
                    "MMMM d, yyyy",
                  )}
                </p>
              )}
            </div>
          </Card>

          {/* Subscription Details */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-base font-medium">Subscription Details</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-accent/30 rounded-md p-4">
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  Plan
                </h4>
                <p className="text-lg font-medium capitalize">
                  {subscription.plan}
                </p>
              </div>

              <div className="bg-accent/30 rounded-md p-4">
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  Period Start
                </h4>
                <p className="font-medium">
                  {format(
                    new Date(subscription.periodStart ?? new Date()),
                    "MMMM d, yyyy",
                  )}
                </p>
              </div>

              <div className="bg-accent/30 rounded-md p-4">
                <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                  Period End
                </h4>
                <p className="font-medium">
                  {format(
                    new Date(subscription.periodEnd ?? new Date()),
                    "MMMM d, yyyy",
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Plan Limits */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-base font-medium">Plan limits</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(subscription.limits ?? {}).map(([key, value]) => {
                const limitConfig =
                  LIMITS_CONFIG[key as keyof typeof LIMITS_CONFIG];
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!limitConfig) return null;

                const Icon = limitConfig.icon;

                return (
                  <div key={key} className="bg-accent/30 rounded-md p-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <Icon className="text-primary size-5" />
                      <h4 className="font-medium">
                        {limitConfig.getLabel(value)}
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {limitConfig.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-end gap-3 border-t pt-6 sm:flex-row">
          <LoadingButton
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => manageSubscriptionMutation.mutate()}
            loading={manageSubscriptionMutation.isPending}
          >
            <ArrowUpCircle className="mr-2 size-4" />
            Manage Subscription
          </LoadingButton>

          {subscription.status === "trialing" ? (
            <></>
          ) : subscription.status === "active" ? (
            <>
              {!subscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/servers/${props.serverSlug}/settings/billing/cancel`,
                    )
                  }
                >
                  <XCircle className="mr-2 size-4" />
                  Cancel Subscription
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full sm:w-auto">
              <CreditCard className="mr-2 size-4" />
              Reactivate Subscription
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Status configuration with colors and descriptions
const STATUS_CONFIG = {
  trialing: {
    label: "Trial",
    description: "Your free trial is active",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: Clock,
  },
  active: {
    label: "Active",
    description: "Your subscription is active",
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: CheckCircle2,
  },
  canceled: {
    label: "Canceled",
    description: "Your subscription has been canceled",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    icon: XCircle,
  },
  past_due: {
    label: "Past Due",
    description: "Your payment is past due",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: AlertCircle,
  },
  unpaid: {
    label: "Unpaid",
    description: "Your subscription is unpaid",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: AlertCircle,
  },
  incomplete: {
    label: "Incomplete",
    description: "Your subscription setup is incomplete",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    icon: AlertCircle,
  },
};
