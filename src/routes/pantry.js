import express from "express";
import { addPantryItem, deletePantryItem, getPantryItems, updatePantryItem } from "../controllers/pantryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import authoriseRole from "../middlewares/roleBasedAccess.js";

const router = express.Router();

router.use(authMiddleware)
router.use(authoriseRole("pantry"))

router.get("/",  getPantryItems)
router.post("/",  addPantryItem)      
router.put("/:id",  updatePantryItem)
router.delete("/:id",  deletePantryItem)

export default router