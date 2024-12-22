import { v2 as cloudinary } from "cloudinary";
import restaurantModel from "../models/restaurantModel.js";
import validator from 'validator'

const addRestaurant = async (req, res) => {
  try {
    const {
      name,
      ownername,
      desc,
      contactno,
      address,
      email,
      deliverytime,
      timing,
    } = req.body;
  
    const imageFile = req.file;
  
    // missing details
    if (
      (!name,
      !ownername,
      !imageFile,
      !desc,
      !contactno,
      !address,
      !email,
      !deliverytime,
      !timing)
    ) {
      return res.json({ success: false, message: "Missing details" });
    }

    // validate data
    if(!validator.isEmail(email)){
      return res.json({ success: false, message: "Email must be in formate" });
    }

    if(!validator.isMobilePhone(contactno)){
      return res.json({ success: false, message: "contact no must be in formate" });
    }
  
    // upload img in cloudinary
    const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
  
    const imageUrl = uploadImage.secure_url;
  
    // add data to database
    const restaurantData = {
      name,
      ownername,
      desc,
      contactno,
      address,
      email,
      deliverytime,
      timing,
      image:imageUrl
    };
  
    const newRestaurant = new restaurantModel(restaurantData);
  
    await newRestaurant.save();
  
    res.json({ success: true, message: "request sent successfully for adding restaurant" });

  } catch (err) {
    console.log(err)
    res.json({ success: false, message: "Something went wrong" });
  }
};

export { addRestaurant };
