import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddress, removeAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.post('/add-address', authUser, addAddress);
addressRouter.post('/get-address', authUser, getAddress);
addressRouter.post('/remove-address', authUser, removeAddress);


export default addressRouter;
