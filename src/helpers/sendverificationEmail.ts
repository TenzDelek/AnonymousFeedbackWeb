//main part of resend where we import both the connection and the format

import { resend } from "@/lib/resend"; //we are making seperate code for better understanding
import VerificationEmail from "../../emails/VerificationEmail"; // format for ui
import { ApiResponse } from "@/types/ApiResponse"; //a standard way to declare type

export async function sendVerificationEmail(
    email:string, username:string, verifycode:string
):Promise<ApiResponse> //we are standardising the what return we are expecting
{
    try {
        //from the docs
            await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: ' Verification Code',
            react:VerificationEmail({username,otp:verifycode}),
          });
        return {success:true,message:"successfully send the email verification",}
    } catch (error) {
        console.error(`error sending verifcation mail${error}`)
        
        //return because promise is expecting
        return {success:false,message:"failed to send email"}
     }
}