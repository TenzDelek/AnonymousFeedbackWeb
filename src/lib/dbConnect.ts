import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}

const connection:ConnectionObject={}

export async function dbConnect():Promise<void> // promise is what we are getting back
{
    if(connection.isConnected)
        {
            console.log("already connected")
            return
        }
    try {
       const db= await mongoose.connect(process.env.MONGO_URI || "",{})
       connection.isConnected= db.connections[0].readyState
        console.log("db connected success")
    } catch (error) {
        console.log(`something went wrong in connecting with the database ${error}`)
        process.exit(1)
    }
}