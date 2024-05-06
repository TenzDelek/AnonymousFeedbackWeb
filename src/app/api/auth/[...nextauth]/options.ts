import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
  //from the docs
  providers: [
    //github,google providers are easy as compare to this
    //we are using credentialsprovider (one of the hardest)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: { //what do we want in credentials
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //for github,google nextauth do this part
      async authorize(credentials: any): Promise<any> { // as we are making our own we need to make authorization ourself // 
        await dbConnect();
        try {
          //checking for user (most basic steps for a backend)
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
      if(token)
        {
          session.user._id= token._id
          session.user.isVerified=token.isVerified
          session.user.isAcceptingMessages=token.isAcceptingMessages
          session.user.username=token.username
        }
      return session;
    },
   
  },
  pages: { //overriding pages / default is /auth
    signIn: "/sign-in", // now for this route nextauth handle all the design
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
