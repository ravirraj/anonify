import {string, z} from "zod"

export const verifySchema = z.object({
    code: string().length(6 , "verification code must be 6 digit")
})