import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export type TodoInput = z.infer<typeof todoSchema>;
