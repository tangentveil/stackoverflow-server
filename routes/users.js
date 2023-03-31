import express from "express";
import { login, signup } from "../controllers/auth.js";
import {
  getAllUsers,
  updateProfile,
  Following,
  userDetails,
  Alluser,
  updateSubscription,
} from "../controllers/Users.js";
import auth from "../middlewares/auth.js";
import authP from "../middlewares/authP.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);
router.put("/following/:id",authP, Following);
router.get('/post/user/details/:id', userDetails)
router.get("/all/user/:id", Alluser)
router.put("/updateSub/:id", updateSubscription)


// router.get("/search", friendSearch);

export default router;
