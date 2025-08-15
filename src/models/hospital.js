import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema({
    hospitalID: {
        type: String,
        required: true,
        unique: true
    },
    hospitalName: {
        type: String,
        required: true,
    },
    createdBy:{
        type:String,
    }
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;