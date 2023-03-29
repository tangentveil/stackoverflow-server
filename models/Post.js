import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  like: { type: Array },
  dislike: { type: Array },
  comments: [
    {
      user: { type: mongoose.Schema.ObjectId, required: true },
      name: { type: String},
      comment: { type: String, required: true },
    },
  ],
});

export default mongoose.model("Post", postSchema);
