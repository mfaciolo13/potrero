import { z } from "zod";

const legalDocumentSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(
    z.object({
      heading: z.string().min(1),
      blocks: z.array(z.union([z.string().min(1), z.array(z.string().min(1))])),
    }),
  ),
});

export const policyDocumentsSchema = z.object({
  terms: legalDocumentSchema,
  privacy: legalDocumentSchema,
  accountDeletion: legalDocumentSchema,
});

export type PolicyDocuments = z.infer<typeof policyDocumentsSchema>;
