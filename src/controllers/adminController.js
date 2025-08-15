import bcrypt from "bcryptjs";
import Admin from "../models/admins.js";
import jwt from "jsonwebtoken"


const register = async (req, res) => {
  try {
    const { email, password, role,hospitalID } = req.body; 
    if (!email || !password || !role || !hospitalID) {
      return res.status(400).json({success:false, message: 'Missing required fields' });
    }
    const existingAdmin = await Admin.findOne({ email });
    if(existingAdmin){
      return res.status(400).json({success:false, message: 'Admin already exists with this Email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email:email, password: hashedPassword, role:role, hospitalID:hospitalID });
    await newAdmin.save();
    const token = jwt.sign(
      { email: email, role:role, hospitalID:hospitalID },
      process.env.JWT_SECRET, 
      { expiresIn: '5d' }
    );  
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge:5 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({success:true, message: 'Admin registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message: 'Registration failed' });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({success:false, message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({success:false, message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { email: admin.email, role:admin.role, hospitalID:admin.hospitalID },
      process.env.JWT_SECRET, 
      { expiresIn: '5d' }
    );  
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge:5 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({success:true, message:"Login successfull" });
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message: 'Login failed, unexpected error occured' });
  }
}

const logout = (req , res)=>{
  res.clearCookie('token');
  res.json({message:"Logout successfull", redirectURL:"/login"})
}

export {register, login, logout}