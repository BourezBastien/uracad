import { stripe as stripePlugin } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink, organization } from "better-auth/plugins";
import { ac, roles } from "./auth/auth-permissions";

import { sendEmail } from "@/lib/mail/send-email";
import { SiteConfig } from "@/site-config";
import MarkdownEmail from "@email/markdown.email";
import type Stripe from "stripe";
import {
  setupDefaultServersOrInviteUser,
  setupResendCustomer,
} from "./auth/auth-config-setup";
import { AUTH_PLANS } from "./auth/auth-plans";
import { env } from "./env";
import { logger } from "./logger";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";
import { stripe } from "./stripe";

type SocialProvidersType = Parameters<typeof betterAuth>[0]["socialProviders"];

export const SocialProviders: SocialProvidersType = {};

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  SocialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  };
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  SocialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await setupDefaultServersOrInviteUser(user);
          await setupResendCustomer(user);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: MarkdownEmail({
          preview: `Reset your password for ${SiteConfig.title}`,
          markdown: `
          Hello,

          You requested to reset your password.

          [Click here to reset your password](${url})
          `,
        }),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: "Change email address",
          react: MarkdownEmail({
            preview: `Change your email address for ${SiteConfig.title}`,
            markdown: `
            Hello,

            You requested to change your email address.

            [Click here to verify your new email address](${url})
            `,
          }),
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const url = `${getServerUrl()}/auth/confirm-delete?token=${token}&callbackUrl=/auth/goodbye`;
        await sendEmail({
          to: user.email,
          subject: "Delete your account",
          react: MarkdownEmail({
            preview: `Delete your account from ${SiteConfig.title}`,
            markdown: `
            Hello,

            You requested to delete your account.

            [Click here to confirm account deletion](${url})
            `,
          }),
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: MarkdownEmail({
          preview: `Verify your email for ${SiteConfig.title}`,
          markdown: `
          Hello,

          Welcome to ${SiteConfig.title}! Please verify your email address.

          [Click here to verify your email](${url})
          `,
        }),
      });
    },
  },
  socialProviders: SocialProviders,
  plugins: [
    organization({
      ac: ac,
      roles: roles,
      organizationLimit: 5,
      membershipLimit: 10,
      async sendInvitationEmail({ id, email }) {
        const inviteLink = `${getServerUrl()}/servers/accept-invitation/${id}`;
        await sendEmail({
          to: email,
          subject: "You are invited to join a server",
          react: MarkdownEmail({
            preview: `Join a server on ${SiteConfig.title}`,
            markdown: `
            Hello,

            You have been invited to join a server on ${SiteConfig.title}.

            [Click here to accept the invitation](${inviteLink})
            `,
          }),
        });
      },
    }),
    stripePlugin({
      stripeClient: stripe,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
      createCustomerOnSignUp: true,
      subscription: {
        onSubscriptionUpdate: async ({ event, subscription }) => {
          const object = event.data.object as Stripe.Subscription;
          const priceId = object.items.data[0].price.id;

          const matchingPlan = AUTH_PLANS.find(
            (p) => p.annualDiscountPriceId === priceId || p.priceId === priceId,
          );

          if (!matchingPlan) {
            logger.error("No matching plan found", { event, subscription });
            return;
          }

          if (subscription.plan === matchingPlan.name) {
            return;
          }

          // Sync the subscription plan with the matching plan
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              plan: matchingPlan.name,
            },
          });
        },
        authorizeReference: async ({ user, referenceId }) => {
          const member = await prisma.member.findFirst({
            where: {
              userId: user.id,
              organizationId: referenceId,
            },
          });

          return member?.role === "owner" || member?.role === "admin";
        },
        enabled: true,
        plans: AUTH_PLANS,
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in to your account",
          react: MarkdownEmail({
            preview: `Magic link to login ${SiteConfig.title}`,
            markdown: `
            Hello,

            You requested a magic link to sign in to your account.

            [Click here to sign in](${url})
            `,
          }),
        });
      },
    }),
    // Warning: always last plugin
    nextCookies(),
  ],
});
