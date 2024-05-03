//keep in mind that on every route if db is use then it 
//should be imported everytime,because it run on edge time
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendverificationEmail";

export async function POST(request:Request) {
    await dbConnect()
    try {
     const{username,email,password}= await request.json()
    } catch (error) {
        //for cli
     console.error(`error registering user${error}`)   
     //for ui
     return Response.json({
        success:false,
        message:"Error in registering user"
     },
    {
        status:500
    })
    }
}