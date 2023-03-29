import express from "express";
import {
  AskQuestion,
  deleteQuestion,
  voteQuestion,
  updateSubscription,
} from "../controllers/AskQuestion.js";
import { getAllQuestions } from "../controllers/getAllQuestions.js";
import auth from '../middlewares/auth.js'

const router = express.Router();

router.post("/Ask/:id", auth, AskQuestion);  // only logined user can post that's why we used 'auth' from middlewares which verifies the login token

router.patch('/Ask/:id', auth, updateSubscription)

router.get("/get", getAllQuestions);  // all user can see
router.delete('/delete/:id', auth,  deleteQuestion);
router.patch('/vote/:id', auth, voteQuestion)

export default router;
