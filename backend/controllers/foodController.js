import mongoose from "mongoose";
import foodModel from "../models/FoodModel.js";
import {v2 as cloudinary} from 'cloudinary'

const addFood = async (req,res) => {
  try {
    
    const {name,oldprice, newprice, rating, veg, desc} = req.body;

    console.log(name,oldprice, newprice, rating, veg, desc)

    const imageFile = req.file

    // Checking missing details
    if(!name, !newprice, !veg, !desc){
      return res.json({success:false, message:"Missing details"})
    }

    // validate price
    const regex = /^[0-9]+$/;
    if(!oldprice === regex || !newprice === regex){
      return res.json({success:false, message:"price must be in number"})
    }

    // upload image in cloudinary
    const uploadImage = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})

    const imageUrl = uploadImage.secure_url

    console.log(imageUrl)

    // Add data in database
    const foodData = {
      name,
      oldprice,
      newprice,
      veg,
      desc,
      rating,
      image:imageUrl
    }

    console.log(foodData);

    const newFood = new foodModel(foodData);

    await newFood.save();

    res.json({success:true, message:"Food upload successfully"})

  } catch (err) {
    res.status(404).json({success: false, message: "Something went wrong, please try again"});
  }
}

export {addFood}