//keep in mind that on every route if db is use then it
//should be imported everytime,because it run on edge time
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendverificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existinguserverifybyusername = await UserModel.findOne({
      username,
      isVerified: true,
    }); //both should satisfied
    if (existinguserverifybyusername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existinguserbyemail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existinguserbyemail) {
      if(existinguserbyemail.isVerified)
        {
          return Response.json(
            {
              success: false,
              message: "User already exist with this email",
            },
            {
              status: 500,
            }
          );
        }
        else{
          const hashedpassword= await bcrypt.hash(password,10)
          //change password only
          existinguserbyemail.password=hashedpassword;
          existinguserbyemail.verifyCode=verifycode;
          existinguserbyemail.verifyCodeExpiry=new Date(Date.now()+ 3600000)
          await existinguserbyemail.save()
        }
    } else {
      //first time user
      const hashedpassword = await bcrypt.hash(password, 10);
      const expirydata = new Date();
      //we are declaring const but we are changing why- cause new keyword makes a object and ref
      expirydata.setHours(expirydata.getHours() + 1); //1hr more

      const newuser = new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode: verifycode,
        verifyCodeExpiry: expirydata,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newuser.save();
    }
    //send verification email -for both the case of existing user my email and new user
    const emailresponse = await sendVerificationEmail(
      email,
      username,
      verifycode
    );
    if (!emailresponse.success) {
      return Response.json(
        {
          success: false,
          message: emailresponse.message,
        },
        {
          status: 500,
        }
      );
    }

    //if success
    return Response.json(
        {
          success: true,
          message: "user register success, verify your mail",
        },
        {
          status: 201,
        }
      );
  } catch (error) {
    //for cli
    console.error(`error registering user${error}`);
    //for ui
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
