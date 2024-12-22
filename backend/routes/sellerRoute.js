import express from 'express';
import { register, login } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.post('/register', register);
sellerRouter.post('/login', login);

export default sellerRouter;