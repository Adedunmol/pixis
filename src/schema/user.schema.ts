import z from 'zod';

export const changePasswordSchema = z.object({
    oldPassword: z.string({ required_error: 'Old password required' }),
    newPassword: z.string({ required_error: 'New Password' }).min(5),
    confirmPassword: z.string({ required_error: 'Confirm password is required' })
}).refine((data) => {
    return data.newPassword === data.confirmPassword
}, {
    message: 'Passwords must match'
})

export type changePasswordSchema = z.infer<typeof changePasswordSchema>