"use client";

import { Divider } from "@/components/uracad/divider";
import { Typography } from "@/components/uracad/typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProviderButton } from "./provider-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { logger } from "@/lib/logger";

const MagicLinkFormSchema = z.object({
  email: z.string().email(),
});

type MagicLinkFormType = z.infer<typeof MagicLinkFormSchema>;

const MagicLinkForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const form = useZodForm({
    schema: MagicLinkFormSchema,
  });

  const signInMutation = useMutation({
    mutationFn: async (values: MagicLinkFormType) => {
      return unwrapSafePromise(
        authClient.signIn.magicLink({
          email: values.email,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      window.location.href = `${window.location.origin}/auth/verify`;
    },
  });

  function onSubmit(values: MagicLinkFormType) {
    signInMutation.mutate(values);
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-lg space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john@doe.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LoadingButton
        loading={signInMutation.isPending}
        type="submit"
        className="ring-offset-card w-full ring-offset-2"
      >
        Sign in with magic link
      </LoadingButton>
    </Form>
  );
};

export const SignInProviders = ({
  providers,
  callbackUrl,
}: {
  providers: string[];
  callbackUrl?: string;
}) => {
  const searchParams = useSearchParams();
  const callbackUrlParams = searchParams.get("callbackUrl");

  if (!callbackUrl) {
    callbackUrl = callbackUrlParams as string;
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <MagicLinkForm callbackUrl={callbackUrl} />
      
      {providers.length > 0 && <Divider>or</Divider>}
      
      <div className="flex flex-col gap-2 lg:gap-4">
        {providers.includes("github") ? (
          <ProviderButton providerId="github" callbackUrl={callbackUrl} />
        ) : null}
        {providers.includes("google") ? (
          <ProviderButton providerId="google" callbackUrl={callbackUrl} />
        ) : null}
        {providers.includes("discord") ? (
          <ProviderButton providerId="discord" callbackUrl={callbackUrl} />
        ) : null}
      </div>

      {/* <Typography variant="muted" className="text-xs">
        You don't have an account?{" "}
        <Typography
          variant="link"
          as={Link}
          href={`/auth/signup?callbackUrl=${callbackUrl}`}
        >
          Sign up
        </Typography>
      </Typography> */}
    </div>
  );
};
