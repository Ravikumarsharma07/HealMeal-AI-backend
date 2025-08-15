import express from "express";
import { login, logout, register } from "../controllers/adminController.js";

const router = express.Router()

router.post("/logout", logout)

router.post('/register', register);

router.post('/login', login);

export default router;