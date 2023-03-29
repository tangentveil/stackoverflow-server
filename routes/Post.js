import express from "express";

const router = express.Router();
import authP from "../middlewares/authP.js";
import {
  postData,
  getPost,
  putPost,
  likePost,
  dislikePost,
  Comment,
  deletePost,
  following,
  followers,
  allPosts
} from "../controllers/post.js";

router.post("/user/post", authP, postData);
router.get("/get/post/:id", getPost);
router.put("/update/post/:id", putPost);
router.put("/:id/like", authP, likePost);
router.put("/:id/dislike", authP, dislikePost);
router.put("/comment/post", authP, Comment);
router.delete("/delete/post/:id", deletePost);
router.get("/following/:id", following);
router.get("/followers/:id", followers);

router.get('/AllPosts', allPosts)

export default router;
