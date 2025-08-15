import Patients from "../models/Patients.js";
import jwt from "jsonwebtoken";
import z from "zod";
import generateDietPlan from "./aiDietPlanController.js";
import Pantry from "../models/pantry.js";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .string()
    .min(0, "Age must be a positive number")
    .max(150, "Age must be realistic"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  isLowSugarDiet: z.boolean(),
  isNoSaltDiet: z.boolean(),
  dietPlan: z.object({
    morning: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
    evening: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
    night: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    }),
  }),
  diseases: z.array(z.string()),
  allergies: z.array(z.string()),
});

const getPatients = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { hospitalID } = decoded;
    const patients = await Patients.find({ hospitalID: hospitalID });
    res.status(200).json({ patients, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const addPatient = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const response = patientSchema.safeParse(req.body);
    if (!response.success) {
      return res
        .status(200)
        .json({ message: "Invalid patient data", success: false });
    }
    const { hospitalID } = decoded;
    let { name, age, gender, contact, roomNumber, bedNumber } = req.body;
    if (
      !name ||
      age === undefined ||
      age === null ||
      !gender ||
      !contact ||
      !roomNumber ||
      !bedNumber ||
      !hospitalID
    ) {
      return res
        .status(200)
        .json({ message: "Missing required fields", success: false });
    }

    // creating AI generated diet plan
    const diseases = req.body.diseases.toString();
    const allergies = req.body.allergies.toString();
    await Pantry.updateMany({}, { $set: { hospitalID: "123456" } });
    const patientInfo =
      "Age: " +
      age +
      "\nGender: " +
      gender +
      "\nLow Sugar Diet: " +
      req.body.isLowSugarDiet +
      "\nNo Salt Diet: " +
      req.body.isNoSaltDiet +
      "\nDiseases: " +
      diseases +
      "\nAllergies: " +
      allergies;
    const availablePantry = await Pantry.find({
      hospitalID: hospitalID,
    }).select("itemName quantity unit -_id");
    const aiGenDietPlan = await generateDietPlan(patientInfo, availablePantry);
    req.body.dietPlan = aiGenDietPlan;
    const patient = new Patients({
      ...req.body,
      hospitalID,
    });
    await patient.save();
    res
      .status(200)
      .json({ message: "Patient data saved successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while saving patient's data", success: false });
  }
};


const deletePatient = async (req, res) => {
  try {
    await Patients.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Patient deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while deleting patient", success: false });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patients.findById(req.params.id);
    patient.name = req.body.name;
    patient.age = req.body.age;
    patient.gender = req.body.gender;
    patient.contact = req.body.contact;
    patient.roomNumber = req.body.roomNumber;
    patient.bedNumber = req.body.bedNumber;
    patient.isLowSugarDiet = req.body.isLowSugarDiet;
    patient.isNoSaltDiet = req.body.isNoSaltDiet;
    patient.dietPlan = req.body.dietPlan;
    patient.diseases = req.body.diseases;
    patient.allergies = req.body.allergies;
    await patient.save();
    res
      .status(200)
      .json({ message: "Patient updated successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while updating patient", success: false });
  }
};

const updateDietPlan = async (req, res) => {
  try {
    const patient = await Patients.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found", success: false });
    }
    const availablePantry = await Pantry.find({
      hospitalID: patient.hospitalID,
    }).select("itemName quantity unit -_id");
    const diseases = req.body.diseases.toString();
    const allergies = req.body.allergies.toString();
    const patientInfo =
      "Age: " +
      patient.age +
      "\nGender: " +
      patient.gender +
      "\nLow Sugar Diet: " +
      req.body.isLowSugarDiet +
      "\nNo Salt Diet: " +
      req.body.isNoSaltDiet +
      "\nDiseases: " +
      diseases +
      "\nAllergies: " +
      allergies;
    const aiGenDietPlan = await generateDietPlan(patientInfo, availablePantry);
    patient.dietPlan = aiGenDietPlan;

    await patient.save();
    res.status(200).json({
      message: "Diet plan updated successfully",
      dietPlan: aiGenDietPlan,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error while updating diet plan", success: false });
  }
};

export {
  getPatients,
  addPatient,
  deletePatient,
  updatePatient,
  updateDietPlan,
};
