import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
  //from the docs
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("no user found with the given name/mail");
          }
          if (!user.isVerified) {
            throw new Error("user is not verified");
          }
          //only for password we can write it directly other wise we have to use identifier
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("password doesnt match");
          } else {
            return user; // main thing dont forget to return
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) { // user is the one that we return from the credentialsproviders
      if(user)
        {
          token._id=user._id?.toString()
          token.isVerified=user.isVerified;
          token.isAcceptingMessages=user.isAcceptingMessages;
          token.username=user.username;
          
        }  
      
      return token;
      },
    async session({session, token}) {
      return session;
    },
   
  },
  pages: {
    signIn: "/sign-in", // now for this route nextauth handle all the design
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
