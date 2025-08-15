import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import newManagement from "./routes/newManagement.js";
import connectDB from "./db/connectDB.js";
import adminRoutes from "./routes/admin.js";
import patientRoutes from "./routes/patients.js";
import pantryRoutes from "./routes/pantry.js";
const app = express();

dotenv.config();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://heal-meal-ai.vercel.app/"], 
    credentials: true, 
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", newManagement);
app.use("/api", adminRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/pantry", pantryRoutes);

export default app;
