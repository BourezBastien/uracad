"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { FormSchema } from "./form-schemas";
import { createForm } from "./form-actions";
import type { Form, Question } from "@prisma/client";

type BuilderQuestion = {
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "radio";
  options?: string;
  required: boolean;
  order: number;
};

type FormWithQuestions = Form & { questions: Question[] };

export function FormBuilder({ 
  organizationId, 
  serverSlug, 
  initialForm 
}: { 
  organizationId: string; 
  serverSlug: string;
  initialForm?: FormWithQuestions;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<BuilderQuestion[]>(
    initialForm?.questions.map(q => ({
      label: q.label,
      type: q.type as BuilderQuestion["type"],
      options: q.options ?? "",
      required: q.required,
      order: q.order
    })) ?? []
  );
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: initialForm?.title ?? "",
      description: initialForm?.description ?? "",
      organizationId,
      questions: [],
    },
  });

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { label: "", type: "text", options: "", required: false, order: prev.length },
    ]);
  };

  const updateQuestion = (idx: number, field: keyof BuilderQuestion, value: string | boolean) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      if (initialForm) {
        // TODO: Implement updateForm action
        // await updateForm({ ...data, organizationId, questions, formId: initialForm.id });
      } else {
        await createForm({ ...data, organizationId, questions });
      }
      router.push(`/servers/${serverSlug}/settings/forms`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">{initialForm ? "Modifier le formulaire" : "Créer un formulaire"}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Titre</label>
          <Input {...form.register("title")} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <Textarea {...form.register("description")} />
        </div>
        <div>
          <label className="block font-medium mb-2">Questions</label>
          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => (
              <div key={idx} className="border rounded p-3 flex flex-col gap-2 bg-muted">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Intitulé de la question"
                    value={q.label}
                    onChange={e => updateQuestion(idx, "label", e.target.value)}
                    className="flex-1"
                  />
                  <Select value={q.type} onValueChange={val => updateQuestion(idx, "type", val)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="textarea">Paragraphe</SelectItem>
                      <SelectItem value="select">Liste déroulante</SelectItem>
                      <SelectItem value="checkbox">Cases à cocher</SelectItem>
                      <SelectItem value="radio">Boutons radio</SelectItem>
                    </SelectContent>
                  </Select>
                  <Checkbox
                    checked={q.required}
                    onCheckedChange={val => updateQuestion(idx, "required", !!val)}
                  />
                  <span className="text-xs">Obligatoire</span>
                  <Button type="button" variant="ghost" onClick={() => removeQuestion(idx)}>
                    Supprimer
                  </Button>
                </div>
                {(q.type === "select" || q.type === "checkbox" || q.type === "radio") && (
                  <Input
                    placeholder="Options (séparées par des virgules)"
                    value={q.options}
                    onChange={e => updateQuestion(idx, "options", e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addQuestion}>
              Ajouter une question
            </Button>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {initialForm ? "Mettre à jour le formulaire" : "Créer le formulaire"}
        </Button>
      </form>
    </div>
  );
} 