import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(3,"Username must be atleast 2 char")
    .max(10,"Username must not be higher than 10 char ")



export const signUpSchema = z.object({
    username:usernameValidation,
    email : z.string(),
    password : z.string().min(6, "Password 6 ").max(15,"Not bigger thean 15")

})