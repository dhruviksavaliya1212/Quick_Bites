import userModel from "../models/userMOdel.js";

const addAddress = async (req, res) => {
  try {
    const { userId, addressData } = req.body;

    const userData = await userModel.findById(userId);

    let data = await userData.addressData;

    data.push(addressData);

    await userModel.findByIdAndUpdate(userId, { addressData: data });

    res.json({ success: true, message: "Address saved" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Address not saved" });
  }
};

const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);

    const addressData = await userData.addressData;

    if (addressData) {
      res.json({ success: true, addressData, message: "Address saved" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Address not saved" });
  }
};

const removeAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    const userData = await userModel.findById(userId);

    const addressData = await userData.addressData;

    // Find the index of the address to remove
    const indexToRemove = addressData.findIndex((item) => {
      return (
        item.firstname === address.firstname &&
        item.lastname === address.lastname &&
        item.phone === address.phone &&
        item.country === address.country &&
        item.city === address.city &&
        item.state === address.state &&
        item.zipcode === address.zipcode &&
        item.flatno === address.flatno &&
        item.societyName === address.societyName
      );
    });

    if (indexToRemove !== -1) {
      addressData.splice(indexToRemove, 1);
      await userModel.findByIdAndUpdate(userId, { addressData });
      res.json({ success: true, message: "Address removed" });
    } else {
      res.json({ success: false, message: "Address not found" });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "An error occurred" });
  }
};

export { addAddress, getAddress, removeAddress };
