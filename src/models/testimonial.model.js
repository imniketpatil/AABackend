import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  images: [{ type: String, required: true }], // Array of image URL
  trek: { type: Schema.Types.ObjectId, ref: "Trek", required: true },
});

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
