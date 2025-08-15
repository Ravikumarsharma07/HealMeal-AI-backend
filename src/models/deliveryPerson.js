import mongoose from "mongoose";
import Patients from "./Patients";




const deliveryPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    assignedTasks: {
        type: [String],
        default: [],
    },
    patientDetails: {
        type: Patients,
        required: true,
    },
    hospitalID:{
        type:String,
        required:true
    }
});

const DeliveryPerson = mongoose.model("DeliveryPerson", deliveryPersonSchema);
export default DeliveryPerson;