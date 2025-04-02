import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  }
//   by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
});
// we are now registering the schema
mongoose.model("Post", postSchema);
