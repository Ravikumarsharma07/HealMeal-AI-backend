import express from "express";
import { addPatient, deletePatient, getPatients, updateDietPlan, updatePatient } from "../controllers/patientController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import authoriseRole from "../middlewares/roleBasedAccess.js";

const router = express.Router()

router.use(authMiddleware)

router.get("/", getPatients)
router.post("/", authoriseRole("manager"), addPatient)
router.put("/:id",authoriseRole("manager"),  updatePatient)
router.delete("/:id",authoriseRole("manager"),  deletePatient)
router.put("/update-dietplan/:id",authoriseRole("manager"),  updateDietPlan)

export default router