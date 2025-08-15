import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["manager", "delivery", "pantry"]
    },
    hospitalID:{
        type:String,
        required:true
    },
    name:{
        type:String,
    },
    avatar:{
        type:String,
    },

})

const Admin = mongoose.model("Admin", adminSchema)
export default Admin