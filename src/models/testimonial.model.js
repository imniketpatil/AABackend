import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  trek: { type: Schema.Types.ObjectId, ref: "Trek", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }], // Array of image URLs
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
