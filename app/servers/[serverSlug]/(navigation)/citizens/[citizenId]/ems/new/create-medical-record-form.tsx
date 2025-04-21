"use client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { createMedicalRecordAction } from "../../../_components/create-medical-record.action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import { LoadingButton } from "@/features/form/submit-button";

const Schema = z.object({
  type: z.enum(["CARE", "INJURY", "TRAUMA", "PSYCHOLOGY", "DEATH"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isConfidential: z.boolean().default(false),
  isPoliceVisible: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

type Citizen = {
  id: string;
  name: string;
  surname: string;
};

function MedicalRecordForm({ citizen, onSuccess }: { citizen: Citizen; onSuccess?: () => void }) {
  const router = useRouter();
  const form = useZodForm({
    schema: Schema,
    defaultValues: {
      isConfidential: false,
      isPoliceVisible: false,
      restrictedAccess: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof Schema>) => {
      return resolveActionResult(
        createMedicalRecordAction({
          ...data,
          citizenId: citizen.id,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Medical record created successfully");
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form} onSubmit={async (data) => mutation.mutate(data)}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CARE">Care</SelectItem>
                  <SelectItem value="INJURY">Injury</SelectItem>
                  <SelectItem value="TRAUMA">Trauma</SelectItem>
                  <SelectItem value="PSYCHOLOGY">Psychology</SelectItem>
                  <SelectItem value="DEATH">Death</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isConfidential"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Confidential</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this record as confidential
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPoliceVisible"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Police Visible</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Allow police to view this record
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restrictedAccess"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Restricted Access</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Restrict access to this record
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <LoadingButton type="submit" loading={mutation.isPending}>
            Create Record
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}

export function CreateMedicalRecordForm({ citizen }: { citizen: Citizen }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Medical Record
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Medical Record</DialogTitle>
          </DialogHeader>
          <MedicalRecordForm 
            citizen={citizen} 
            onSuccess={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 