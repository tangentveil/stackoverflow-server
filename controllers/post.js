import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/auth.js";

export const postData = async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title,
      image,
      video,
      user: req.user.id,
    });
    const post = await newpost.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal error occured");
  }
};

// upload post by one user
export const getPost = async (req, res) => {
  try {
    const mypost = await Post.find({ user: req.params.id });
    if (!mypost) {
      return res.status(200).json("You don't have any post");
    }

    res.status(200).json(mypost);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

// update user post
export const putPost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json("Post does not found");
    }

    post = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    let updatepost = await post.save();
    res.status(200).json(updatepost);
  } catch (error) {
    return res.status(500).json("Internal error occured");
  }
};

// Like
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.like.includes(req.user.id)) {
      if (post.dislike.includes(req.user.id)) {
        await post.updateOne({ $pull: { dislike: req.user.id } });
      }
      await post.updateOne({ $push: { like: req.user.id } });
      return res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { like: req.user.id } });
      return res.status(200).json("Post has been unlike");
    }
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
};

// Dislike

export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislike.includes(req.user.id)) {
      if (post.like.includes(req.user.id)) {
        await post.updateOne({ $pull: { like: req.user.id } });
      }
      await post.updateOne({ $push: { dislike: req.user.id } });
      return res.status(200).json("Post has been disliked");
    } else {
      await post.updateOne({ $pull: { dislike: req.user.id } });
      return res.status(200).json("Post has been unlike");
    }
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// comment

export const Comment = async (req, res) => {
  try {
    const { comment, postId, name } = req.body;
    const comments = {
      user: req.user.id,
      name: name,
      comment,
    };

    // console.log(comments)
    const post = await Post.findById(postId);
    post.comments.push(comments);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// delete post

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post.user)
    // console.log(req.params.id)
    // console.log(req.user.id);
    // if (post.user === req.user.id) {
    //   const deletepost = await Post.findByIdAndDelete(req.params.id);
    //   return res.status(200).json("You post has been deleted");
    // } else {
    //   return res.status(400).json("You are not allow to delete this post");
    // }
    
    const deletepost = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("You post has been deleted");
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// get a following user
export const following = async (req, res) => {
  const user = await User.findById(req.params.id);
  const followinguser = await Promise.all(
    user.Following.map((item) => {
      return User.findById(item);
    })
  );

  let followingList = [];
  followinguser.map((person) => {
    const { name, email, password, Following, Followers, ...others } =
      person._doc;
    followingList.push(others);
  });

  res.status(200).json(followingList);
};

// get a following user
export const followers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersuser = await Promise.all(
      user.Followers.map((item) => {
        return User.findById(item);
      })
    );

    let followersList = [];
    followersuser.map((person) => {
      const { name, email, password, Following, Followers, ...others } =
        person._doc;
      followersList.push(others);
    });

    res.status(200).json(followersList);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};


// Fetch All posts
export const allPosts = async (req, res) => {
  try {
    const allPost = await Post.find();

    const post = await Promise.all(
      allPost.map((item) => {
        return item;
      })
    );

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
};
