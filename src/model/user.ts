import mongoose ,{ Schema,Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt:Date
}

// in mongoose string is caps
//for type safety
const MessageSchema: Schema<Message>=new Schema(
    {
        content:{
            type:String,
            required:true
        },
        createdAt:{
            type: Date,
            required:true,
            default:Date.now
        }
    }
)

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type: String,
        unique:true,
        required:[true,"username is required"],
        trim:true
    },
    email:{
        type: String,
        unique:true,
        required:[true,"email is required"],
        match:[/.+\@.+\..+/,"please use a valid mail"]
    },
    password:{
        type: String,
        required:[true,"password is required"],

    },
    verifyCode:{
        type: String,
        required:[true,"verifyCode is required"],
        
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true,"verifyCodeExpiry is required"],  
    },
    isAcceptingMessage:{
        type: Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel= (mongoose.models.User as mongoose.Model<User>) || 
    mongoose.model<User>("User",UserSchema)
export default UserModel