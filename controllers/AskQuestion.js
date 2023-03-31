import Questions from "../models/AskQuestion.js";
import mongoose from "mongoose";
import users from "../models/auth.js";

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new Questions({...postQuestionData, userId: req.userId});


  try {
    await postQuestion.save();
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post a new question");
  }
};


export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable..");
  }

  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// vote Question
export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable..");
  }

  try {
    const question = await Questions.findById(_id);

    // id available in question database === userId --> alredy upvoted
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      // user clicked on upvote button
      // checking user already downvoted or not
      if (downIndex !== -1) {
        // user already downVoted
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }

      if (upIndex === -1) {
        // user hasn't Voted yet, so we are adding him in upVote
        question.upVote.push(userId);
      } else {
        // user already voted so we are removing him from upvote
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }

      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }

    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "vote successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};
