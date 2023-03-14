
export {};

interface user {
    id: string
    email: string
}

declare global {
    namespace Express {
        interface Request {
            user
        }
    }
}