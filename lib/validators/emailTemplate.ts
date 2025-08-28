import { z } from "zod";

export const VariableDefSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'date', 'boolean', 'url', 'safeHtml', 'array']),
  required: z.boolean().optional(),
  example: z.any().optional(),
});

export const EmailTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  category: z.enum(['transactional', 'marketing']),
  subjectTemplate: z.string(),
  htmlTemplate: z.string(),
  textTemplate: z.string().optional(),
  variables: z.array(VariableDefSchema).optional(),
  providerOverrides: z.record(z.any()).optional(),
  active: z.boolean().optional(),
});

export type EmailTemplateCreate = z.output<typeof EmailTemplateSchema>;
export type VariableDef = z.output<typeof VariableDefSchema>;
