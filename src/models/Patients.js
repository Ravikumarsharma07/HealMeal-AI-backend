import mongoose from "mongoose";
import dietPlanSchema from "./dietChart.js";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  diseases: {
    type: [String],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
  roomNumber: String,
  bedNumber: {
    type: String,
  },
  isLowSugarDiet: {
    type: Boolean,
  },
  isNoSaltDiet: {
    type: Boolean,
  },
  dietPlan: {
    type: dietPlanSchema,
  },
  hospitalID: {
    type: String,
    required: true,
  },
});

const Patients = mongoose.model("Patients", patientSchema);
export default Patients;
