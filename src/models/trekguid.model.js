import mongoose, { Schema } from "mongoose";

const trekGuideSchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
  experience: { type: Number, required: true },
  treks: [{ type: Schema.Types.ObjectId, ref: "Trek" }],
  images: [{ type: String }], // Array of image URLs
});

const TrekGuide = mongoose.model("TrekGuide", trekGuideSchema);
