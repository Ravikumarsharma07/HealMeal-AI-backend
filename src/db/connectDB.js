import mongoose from "mongoose"


let isConnected;

export default async function dbConnect(){
    if(isConnected){
        console.log("database already connnected")
        return
    }
    try {
        const db = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_PASSWORD}`)  
        isConnected = db.connections[0].readyState 
        console.log("DB connected")  
    } catch (error) {
        console.error("error in connecting database",error)
        process.exit(1)
    } 
}