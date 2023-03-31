import mongoose from "mongoose";
import User from "../models/auth.js";
import Post from "../models/Post.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find();
    const user = await Promise.all(
      allUser.map((item) => {
        return item;
      })
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable..");
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

// Following
export const Following = async (req, res) => {
  if (req.params.id !== req.body.user) {
    const user = await User.findById(req.params.id);
    const otheruser = await User.findById(req.body.user);

    if (!user.Followers.includes(req.body.user)) {
      await user.updateOne({ $push: { Followers: req.body.user } });
      await otheruser.updateOne({ $push: { Following: req.params.id } });
      return res.status(200).json("User has followed");
    } else {
      await user.updateOne({ $pull: { Followers: req.body.user } });
      await otheruser.updateOne({ $pull: { Following: req.params.id } });
      return res.status(200).json("User has Unfollowed");
    }
  } else {
    return res.status(400).json("You can't follow yourself");
  }
};


// get user details for post
export const userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json("User not found");
    }
    const { email, password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

// get user to follow
export const Alluser = async (req, res) => {
  try {
    const allUser = await User.find();
    const user = await User.findById(req.params.id);
    const followinguser = await Promise.all(
      user.Following.map((item) => {
        return item;
      })
    );

    let UserToFollow = allUser.filter((val) => {
      return !followinguser.find((item) => {
        return val._id.toString() === item;
      });
    });

    // can't add "name" here
    let filteruser = await Promise.all(
      UserToFollow.map((item) => {
        const { email, Followers, Following, password, ...others } = item._doc;
        return others;
      })
    );

    res.status(200).json(filteruser);
  } catch (error) {}
};

export const updateSubscription = async (req, res) => {
  try {
    const updateSub = await User.findByIdAndUpdate(req.params.id, {
      nOfQuestionPerDay: nOfQuestionPerDay,
    });
    console.log(updateSub);
    return res.status(200).json(updateSub);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
