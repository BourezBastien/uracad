"use client";

import { Typography } from "@/components/uracad/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleSubscribedAction } from "./mail-account.action";

type ToggleEmailCheckboxProps = {
  unsubscribed: boolean;
};

export const ToggleEmailCheckbox = ({
  unsubscribed,
}: ToggleEmailCheckboxProps) => {
  const mutation = useMutation({
    mutationFn: async (unsubscribed: boolean) => {
      const result = await toggleSubscribedAction({
        unsubscribed,
      });

      if (!result?.data) {
        toast.error(result?.serverError ?? "An error occurred");
        return;
      }

      toast.success("You've updated your email settings.");
    },
  });

  return (
    <div
      className={cn(
        "flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4",
        {
          "bg-muted": mutation.isPending,
        },
      )}
    >
      <Checkbox
        id="unsubscribed-checkbox"
        defaultChecked={unsubscribed}
        disabled={mutation.isPending}
        onCheckedChange={(checked) => {
          const newChecked = Boolean(checked);

          mutation.mutate(newChecked);
        }}
      />
      <div className="space-y-1 leading-none">
        <Label htmlFor="unsubscribed-checkbox">Unsubscribed</Label>
        <Typography variant="muted">
          If enabled, you will not receive any marketing or promotional emails
          from us.
        </Typography>
      </div>
    </div>
  );
};
