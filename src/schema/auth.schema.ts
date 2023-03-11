import z from 'zod';

export const createUserSchema = z.object({
    name: z.string({ required_error: "Name field cannot be empty" }).trim(),
    email: z.string({ required_error: "Email field cannot be empty" }).email({ message: 'Must be a valid email'}).trim(),
    password: z.string({ required_error: "Password field cannot be empty" }).min(5),
    confirmPassword: z.string({ required_error: "Password Confirmation field cannot be empty" })
}).refine((data) => {
    return data.password === data.confirmPassword
}, {
    message: "Passwords must match"
})

export type createUserSchema = z.infer<typeof createUserSchema>