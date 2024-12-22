import sellerModel from "../models/sellerModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check user available or not
    const seller = await sellerModel.findOne({ email });

    if (seller) {
      return res.json({
        success: false,
        message: "Seller already registered!. Please Login",
      });
    }

    // validate the data
    if (name.length < 2) {
      return res.json({
        success: false,
        message: "name must be 2 letter or more",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "email must be in formate" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be 8 character long",
      });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const sellerData = {
      name,
      email,
      password: hashPassword,
    };

    // store user in database
    const newSeller = new sellerModel(sellerData);

    await newSeller.save();

    // create token
    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, message: "Register successfull" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await sellerModel.findOne({ email });

    if (!seller) {
      return res.json({ success: false, message: "Seller not found!" });
    }

    // decrypt the password
    const isMatch = await bcrypt.compare(password, seller.password);

    if (isMatch) {
      const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

      res.json({ success: true, token, message: "login successfull" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export { register, login };
