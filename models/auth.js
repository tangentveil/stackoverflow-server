import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  nOfQuestionPerDay: { type: Number, default: 1 },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  Followers: { type: Array},
  Following: { type: Array },
});

export default mongoose.model("User", userSchema);
