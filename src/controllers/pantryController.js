import Pantry from "../models/pantry.js";
import jwt from "jsonwebtoken";
import {z} from "zod"


const itemSchema = z.object({
    itemName:z.string({message:"Item name is required"}),
    quantity: z.number().min(0),
    threshold: z.number(),
    unit: z.string(),
    expiryDate: z.date(),
    category:z.string()
})


const getPantryItems = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { hospitalID } = decoded;
    const pantryItems = await Pantry.find({ hospitalID: hospitalID });
    res.status(200).json({ pantryItems, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const addPantryItem = async (req, res) => {
  try {
    req.body.expiryDate = new Date(req.body.expiryDate);
    const response = itemSchema.safeParse(req.body)
    if(!response.success){
        return res.status(400).json({message:"Invalid data", success:false})
    }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { hospitalID } = decoded;
    const newItem = new Pantry({
      ...req.body,
      hospitalID,
    });
    await newItem.save();
    return res.status(200).json({message: "Item successfully added", success:true, item:newItem})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updatePantryItem = async (req, res) =>{
  try {
    req.body.expiryDate = new Date(req.body.expiryDate);
    const isValid = itemSchema.safeParse(req.body)
    if(!isValid.success) return res.status(400).json({message:"Invalid data",success:false})
    const item = await Pantry.findById(req.params.id)
    if(item){
      item.itemName = req.body.itemName
      item.category = req.body.category
      item.expiryDate = req.body.expiryDate
      item.quantity = req.body.quantity
      item.threshold = req.body.threshold
      item.unit = req.body.unit
      await item.save();
      res.status(200).json({message:"Item successfully updated", success:true})
    }else{
      res.status(404).json({message: "Item not found", success:false})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}

const deletePantryItem = async (req, res) => {
  try {
    await Pantry.findByIdAndDelete({_id: req.params.id})
    res.status(200).json({message:"Item successfully deleted", success:true})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error", success:false})
  }
}

export {getPantryItems, addPantryItem, updatePantryItem, deletePantryItem}