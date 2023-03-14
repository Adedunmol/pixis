import { type } from 'os';
import z from 'zod';

export const createCardSchema = z.object({
    question: z.string({ required_error: 'A question is required' }),
    answer: z.string({ required_error: 'An answer is required' }),
})

export const updateCardSchema = z.object({
    grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'])
})

export type updateCardSchema = z.infer<typeof updateCardSchema>
export type createCardSchema = z.infer<typeof createCardSchema>