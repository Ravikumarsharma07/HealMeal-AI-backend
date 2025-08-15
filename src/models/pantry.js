import mongoose from "mongoose";

const pantryShema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    hospitalID: {
        type: String,
        required: true,
    }
})

const Pantry = mongoose.model("Pantry", pantryShema);

export default Pantry