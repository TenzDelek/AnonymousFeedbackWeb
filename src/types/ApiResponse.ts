//most of the time it is interface that is used
import { Message } from "@/model/user";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>;
}
//success and message are mandatory
//but isaccepting and messages is not in some case