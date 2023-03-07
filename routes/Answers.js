import express from "express";
import { postAnswer, deleteAnswer } from "../controllers/Answers.js";
import auth from '../middlewares/auth.js'

// only logined user can post and delete that's why we used 'auth' from middlewares which verifies the login token

const router = express.Router();

// adding the data in the existing data
router.patch("/post/:id", auth, postAnswer);

// deleting specific answer
router.patch('/delete/:id', auth, deleteAnswer)

export default router;
