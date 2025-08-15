import express from "express";
import Hospital from "./../models/hospital.js"
import Admin from "../models/admins.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const router = express.Router();

router.post("/new-management", async (req, res) => {
  const {email, password, name, hospitalID, hospitalName} = req.body;
  try {
    const isExistingHospital = await Hospital.findOne({ hospitalID: hospitalID });
    const isExistingEmail  = await Admin.findOne({email: email});
    if (isExistingEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Email already in use"});
    }
    if (isExistingHospital) {
      return res
        .status(401)
        .json({ success: false, message: "Hospital ID already taken"});
    }
    console.log(hospitalID)
    const newHospital = new Hospital({
      hospitalID: hospitalID,
      hospitalName: hospitalName,
      createdBy: name, 

    });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const manager = new Admin({
      email: email,
      role: "manager",
      password: hashedPassword,
      hospitalID: hospitalID,
    });
    await newHospital.save();
    await manager.save();
    const token = jwt.sign(
          { email: email, role:"manager" },
          process.env.JWT_SECRET, 
          { expiresIn: '5d' }
        );  
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
    res
      .status(200)
      .json({ success: true, message: "System Created successfully" });
    
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating new system" });
  }
});

export default router;
