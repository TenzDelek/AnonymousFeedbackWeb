import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "atleast two character should be inputed")
  .max(20, "username max char is 20, try giving less than that")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

//here we are checking multiples so we take object

export const signupSchema= z.object({
    username: usernameValidation,
    email:z.string().email({message:"invalid email address given"}),
    password:z.string().min(4,{message:"minimum four character are needed "})
})