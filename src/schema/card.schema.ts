import z from 'zod';

export const createCardSchema = z.object({
    question: z.string({ required_error: 'A question is required' }),
    answer: z.string({ required_error: 'An answer is required' }),
})

export type createCardSchema = z.infer<typeof createCardSchema>