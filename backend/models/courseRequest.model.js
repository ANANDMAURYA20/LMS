import mongoose from "mongoose";

const courseRequestSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Title must be at least 8 characters"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [20, "Description must be at least 20 characters"],
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminComment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CourseRequest = mongoose.model("CourseRequest", courseRequestSchema);

export default CourseRequest;
