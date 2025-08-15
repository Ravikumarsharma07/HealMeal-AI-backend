import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
  morning: { name: String, ingredients: [String] },
  evening: { name: String, ingredients: [String] },
  night: { name: String, ingredients: [String] },
});

export default dietPlanSchema;
